import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminFetch, adminApiUrl } from './adminApi';

describe('adminFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the configured API URL and includes credentials', () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true } as Response);

    adminFetch('/api/auth/me', { method: 'GET' });

    expect(fetchMock).toHaveBeenCalledWith(`${adminApiUrl}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
  });
});
