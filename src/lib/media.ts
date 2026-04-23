const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const resolveMediaUrl = (
  url: string | null | undefined,
  baseUrl: string = API_URL,
) => {
  if (!url) {
    return '';
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    return url;
  }

  const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

  if (url.startsWith('/uploads/')) {
    return `${trimmedBaseUrl}${url}`;
  }

  if (url.startsWith('uploads/')) {
    return `${trimmedBaseUrl}/${url}`;
  }

  return url;
};
