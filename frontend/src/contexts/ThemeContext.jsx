import { createContext, useContext, useEffect, useState } from 'react';
import { LS_THEME } from '../constants';

// -------------------------------------------------------------------
// ThemeContext
// StateManagement.md section 17 — ThemeProvider
// Design.md section 62 — Theme Switching
// Memory.md section 8 — Local Storage key: "theme"
// -------------------------------------------------------------------

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(LS_THEME) || 'dark';
  });

  // Apply .dark class to <html> element for Tailwind dark: variants
  // and CSS variable switching defined in styles/index.css
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setLightTheme, setDarkTheme, isDark: theme === 'dark' }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}

export default ThemeContext;
