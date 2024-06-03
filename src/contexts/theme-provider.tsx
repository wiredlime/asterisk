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
  theme: Theme | null;
  setTheme: Dispatch<SetStateAction<Theme | null>>;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asterisk",
  description: "Let's chitty chat chit with everyone",
};

export const ThemeContext = createContext<ThemeContext>({
  theme: Theme.ROOT,
  setTheme: () => {},
});

export default function ThemeProvider({ children }: ThemeProviderProps) {
  let initialTheme: Theme | null;

  if (typeof window === undefined) {
    initialTheme = null;
  } else {
    initialTheme =
      (window.localStorage.getItem("theme") as Theme) || Theme.ROOT;
  }

  const [theme, setTheme] = useState<Theme | null>(initialTheme);

  useEffect(() => {
    const currentTheme = window.localStorage.getItem("theme");
    if (!currentTheme) {
      window.localStorage.setItem("theme", Theme.ROOT);
    }
    if (currentTheme && theme !== currentTheme) {
      window.localStorage.setItem("theme", theme || "");
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
