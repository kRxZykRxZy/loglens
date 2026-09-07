export type ApiClientOptions = {
  baseUrl?: string;
  getToken?: () => Promise<string | null | undefined>;
  headers?: Record<string, string>;
  fetchImpl?: typeof fetch;
};

export type ApiErrorBody = { error?: string; code?: string; message?: string; requestId?: string };

export class ApiClientError extends Error {
  status: number;
  code?: string;
  requestId?: string;

  constructor(status: number, message: string, code?: string, requestId?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

type RetryableOptions = {
  maxRetries?: number;
  baseDelayMs?: number;
};

export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  private resolveUrl(path: string): string {
    const base = this.opts.baseUrl ?? '';
    return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async headers(initHeaders?: HeadersInit): Promise<Headers> {
    const headers = new Headers(initHeaders);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (this.opts.headers) {
      for (const [k, v] of Object.entries(this.opts.headers)) headers.set(k, v);
    }
    const token = await this.opts.getToken?.();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  private async doFetch(path: string, init: RequestInit): Promise<Response> {
    const fetchImpl = this.opts.fetchImpl ?? fetch;
    return fetchImpl(this.resolveUrl(path), init);
  }

  async request<T>(
    path: string,
    init: RequestInit = {},
    retryable: RetryableOptions = {},
  ): Promise<T> {
    const maxRetries =
      retryable.maxRetries ?? (init.method === undefined || init.method === 'GET' ? 1 : 0);
    const baseDelayMs = retryable.baseDelayMs ?? 200;
    let lastError: ApiClientError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const headers = await this.headers(init.headers);
      const response = await this.doFetch(path, { ...init, headers });

      if (response.status === 204) return undefined as T;

      const body: ApiErrorBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new ApiClientError(
          response.status,
          body.error ?? body.message ?? `Request failed (${response.status})`,
          body.code,
          body.requestId,
        );
        const retriableStatus = response.status === 429 || response.status >= 500;
        if (attempt < maxRetries && retriableStatus) {
          const delay = baseDelayMs * 2 ** attempt;
          await new Promise((r) => setTimeout(r, delay));
          lastError = error;
          continue;
        }
        throw error;
      }
      return body as T;
    }
    throw lastError ?? new ApiClientError(0, 'Request failed');
  }

  get<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...init, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  put<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  delete<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...init, method: 'DELETE' });
  }
}
