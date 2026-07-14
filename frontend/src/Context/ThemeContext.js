import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Default to light mode. Check localStorage first, then system preference.
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    } catch (err) {
      // localStorage unavailable
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Persist preference
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (err) {
      // localStorage unavailable
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const setLightMode = useCallback(() => {
    setIsDark(false);
  }, []);

  const setDarkMode = useCallback(() => {
    setIsDark(true);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setLightMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
