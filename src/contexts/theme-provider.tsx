"use client";

import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
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

export const ThemeContext = createContext<ThemeContext>({
  theme: Theme.ROOT,
  setTheme: () => {},
});

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(Theme.ROOT);
  // save selected theme to the local storage

  console.log(theme);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="en" className={cn(theme)}>
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeContext.Provider>
  );
}
