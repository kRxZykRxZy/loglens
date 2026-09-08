export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function makeUniqueSlug(base: string, taken: Set<string>): string {
  if (!base) base = 'project';
  if (!taken.has(base)) return base;
  let candidate = '';
  for (let n = 2; n < 1000; n++) {
    candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}
