const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type AdminFetchInit = RequestInit;

export const adminApiUrl = API_URL;

export const adminFetch = (path: string, init: AdminFetchInit = {}) => {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
  });
};
