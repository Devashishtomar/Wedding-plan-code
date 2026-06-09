import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ThemeSwitcherProps {
  className?: string;
  align?: "start" | "end" | "center";
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className={cn(
        "h-9 w-9 rounded-xl border border-border/40 hover:bg-muted/80 text-foreground transition-all duration-300 relative overflow-hidden group shrink-0",
        className
      )}
      title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <div className="relative h-5 w-5 transition-transform duration-500 group-hover:rotate-12">
        {mode === "light" ? (
          <Sun className="h-5 w-5 text-amber-500 transition-all duration-300 absolute inset-0 rotate-0 scale-100" />
        ) : (
          <Moon className="h-5 w-5 text-primary transition-all duration-300 absolute inset-0 rotate-0 scale-100" />
        )}
      </div>
    </Button>
  );
};

export default ThemeSwitcher;
