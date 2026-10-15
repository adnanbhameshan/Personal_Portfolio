import { useEffect, useState } from "react";

export type Theme = "dark" | "light";
const storageKey = "nexus.theme";

function initialTheme(): Theme {
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);
  return { theme, toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark") };
}
