import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const KEY = 'fluxo:theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (
    localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
