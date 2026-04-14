import { Moon, Sun, Monitor, Search, Command } from 'lucide-react';
import { useStore } from '../store';
import { useEffect } from 'react';

export function Header() {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand flex items-center justify-center shadow-lg shadow-primary/20">
          <Monitor className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Dev Tools
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            className="w-64 h-9 pl-9 pr-12 rounded-full bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 pointer-events-none">
            <Command className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-[10px] font-bold text-muted-foreground/50">K</span>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-orange-400" />
          ) : (
            <Moon className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>
    </header>
  );
}
