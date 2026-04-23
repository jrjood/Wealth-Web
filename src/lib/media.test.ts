import { describe, expect, it } from 'vitest';
import { resolveMediaUrl } from './media';

describe('resolveMediaUrl', () => {
  it('prefixes upload paths with the API base URL', () => {
    expect(resolveMediaUrl('/uploads/image.jpg', 'http://localhost:3001')).toBe(
      'http://localhost:3001/uploads/image.jpg',
    );
    expect(resolveMediaUrl('uploads/image.jpg', 'http://localhost:3001')).toBe(
      'http://localhost:3001/uploads/image.jpg',
    );
  });

  it('leaves absolute URLs untouched', () => {
    expect(resolveMediaUrl('https://cdn.example.com/image.jpg')).toBe(
      'https://cdn.example.com/image.jpg',
    );
  });
});
