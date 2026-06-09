import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeType = "rose" | "royal" | "boho" | "modern";
export type ModeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  mode: ModeType;
  setTheme: (theme: ThemeType) => void;
  setMode: (mode: ModeType) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("app-theme") as ThemeType;
    return saved && ["rose", "royal", "boho", "modern"].includes(saved) ? saved : "modern";
  });

  const [mode, setModeState] = useState<ModeType>(() => {
    const saved = localStorage.getItem("app-mode") as ModeType;
    return saved && ["light", "dark"].includes(saved) ? saved : "dark"; // Default to dark for landing page aesthetic
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const setMode = (newMode: ModeType) => {
    setModeState(newMode);
    localStorage.setItem("app-mode", newMode);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme classes
    root.classList.remove("theme-rose", "theme-royal", "theme-boho", "theme-modern");
    // Add new theme class
    root.classList.add(`theme-${theme}`);

    // Remove all previous mode classes
    root.classList.remove("light", "dark");
    // Add new mode class
    root.classList.add(mode);
    
    // Force background and text updates on root for dashboard compatibility
    root.style.colorScheme = mode;
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
