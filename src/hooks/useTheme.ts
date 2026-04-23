import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'wealth-holding-theme' || !event.newValue) return;
      setTheme(event.newValue as Theme);
    };

    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme) setTheme(nextTheme);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('wealth-holding-theme', theme);
    window.dispatchEvent(
      new CustomEvent<Theme>('theme-change', { detail: theme }),
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, setTheme };
};
