# @loglens/api-client

Fetch-based REST client for the LogLens API, reusable by the web app, the future SDK, and the CLI.

## Features

- Optional `baseUrl` (web passes `/api`; SDK/CLI pass an absolute origin).
- Optional `getToken()` async callback; a returned token becomes a `Bearer` header.
- Automatic retry with backoff for `429` and `5xx` on GET requests (and any request that opts in).
- JSON body serialization for `post`/`put`.
- Normalized errors: throws `ApiClientError` with `status`, stable `code`, and `requestId`.

## API

```ts
import { ApiClient } from '@loglens/api-client';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  getToken: async () => storage.get('token'),
});

await client.post<{ project: Project }>('/v1/projects', { name: 'web' });
await client.get<{ projects: Project[] }>('/v1/projects');
```

This client is the HTTP contract layer shared by all LogLens consumers and deliberately contains no server-only logic.
