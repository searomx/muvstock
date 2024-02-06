'use client';
import React, { createContext, useContext, useState } from "react";

type ThemeContextProviderProps = {
  children: React.ReactNode;
}
type Theme = 'light' | 'dark';

type ThemeContext = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContext | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )

}
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
}


