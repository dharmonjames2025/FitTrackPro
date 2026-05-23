// File: src/context/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export interface Theme {
  bg: string;
  cardBg: string;
  text: string;
  subText: string;
  border: string;
  headerBg: string;
  tabBar: string;
  tabBorder: string;
}

const light: Theme = {
  bg: '#F2F2F7', cardBg: '#FFFFFF', text: '#1C1C1E', subText: '#8E8E93',
  border: '#F2F2F7', headerBg: '#FFFFFF', tabBar: '#FFFFFF', tabBorder: '#E5E5EA',
};

const dark: Theme = {
  bg: '#000000', cardBg: '#1C1C1E', text: '#FFFFFF', subText: '#AAAAAA',
  border: '#333333', headerBg: '#1C1C1E', tabBar: '#000000', tabBorder: '#333333',
};

const ThemeContext = createContext<Theme>(light);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useAuth();
  return <ThemeContext.Provider value={darkMode ? dark : light}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);