import { describe, expect, it } from 'vitest';
import { makeUniqueSlug, slugify } from './slug.js';

describe('slugify', () => {
  it('lowercases and collapses separators', () => {
    expect(slugify('My Cool Project')).toBe('my-cool-project');
  });

  it('trims leading and trailing separators', () => {
    expect(slugify('--!!__Hello__--')).toBe('hello');
  });

  it('caps length at 48', () => {
    expect(slugify('a'.repeat(100)).length).toBeLessThanOrEqual(48);
  });
});

describe('makeUniqueSlug', () => {
  it('returns the base when free', () => {
    expect(makeUniqueSlug('widgets', new Set(['other']))).toBe('widgets');
  });

  it('appends -2 when base is taken', () => {
    expect(makeUniqueSlug('widgets', new Set(['widgets']))).toBe('widgets-2');
  });

  it('increments until a free slug is found', () => {
    const taken = new Set(['widgets', 'widgets-2', 'widgets-3']);
    expect(makeUniqueSlug('widgets', taken)).toBe('widgets-4');
  });

  it('falls back to an empty base', () => {
    expect(makeUniqueSlug('', new Set())).toBe('project');
  });
});
