export const getYouTubeEmbedUrl = (url: string | null | undefined) => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    if (hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const isDirectVideoUrl = (url: string | null | undefined) => {
  if (!url) {
    return false;
  }

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
};
