import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export function useSEO({
  title = 'Wealth Holding | Premium Real Estate in Egypt',
  description = 'Wealth Holding delivers premium real estate developments in Egypt, combining design excellence, strategic locations, and long-term investment value.',
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update description meta tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }
  }, [title, description]);
}
