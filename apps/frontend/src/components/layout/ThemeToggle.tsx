import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
    {theme === "dark" ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
  </Button>;
}
