import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof COLORS;
}

const darkColors = {
  ...COLORS,
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  primary: {
    ...COLORS.primary,
    light: '#311B3B',
  },
  neutral: {
    ...COLORS.neutral,
    light: '#2D2D2D',
    medium: '#404040',
    darkGray: '#A0A0A0',
  },
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  useEffect(() => {
    setTheme(systemColorScheme || 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    colors: theme === 'dark' ? darkColors : COLORS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 