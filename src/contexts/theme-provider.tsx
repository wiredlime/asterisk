"use client";

import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export enum Theme {
  ROOT = "root",
  DARK = "dark",
  MIDNIGHT = "midnight",
  GAY = "gay",
}

interface ThemeContext {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asterisk",
  description: "Let's chitty chat chit with everyone",
};

const currentTheme = (localStorage.getItem("theme") as Theme) || Theme.ROOT;

export const ThemeContext = createContext<ThemeContext>({
  theme: currentTheme,
  setTheme: () => {},
});

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
      localStorage.setItem("theme", Theme.ROOT);
    }
    if (currentTheme && theme !== currentTheme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="en" className={cn(theme)}>
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeContext.Provider>
  );
}
