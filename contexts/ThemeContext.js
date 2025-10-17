// contexts/ThemeContext.js
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };
  const value = { theme, toggleTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);