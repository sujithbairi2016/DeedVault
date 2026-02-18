import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import themesData from '../../data/themes.json';

interface Theme {
  themeId: number;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerGradientStart: string;
  headerGradientEnd: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: number) => void;
  applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themes = themesData as Theme[];
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--header-gradient-start', theme.headerGradientStart);
    document.documentElement.style.setProperty('--header-gradient-end', theme.headerGradientEnd);
  };

  const setTheme = (themeId: number) => {
    const theme = themes.find(t => t.themeId === themeId) || themes[0];
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
