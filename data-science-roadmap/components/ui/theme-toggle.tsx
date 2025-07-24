import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, set initial theme from localStorage or system
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (stored === "dark" || (!stored && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    document.documentElement.classList.toggle("dark", isNowDark);
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-2"
      onClick={toggleTheme}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? "☀️" : "🌙"}
    </Button>
  );
}
