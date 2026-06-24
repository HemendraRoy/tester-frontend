import { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui/Button';

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="!p-1.5"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </Button>
  );
}


export function AppHeader() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="relative flex h-10 shrink-0 items-center justify-between border-b border-border bg-surface-secondary px-3">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-text-primary">
          Tester
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://digitalheroesco.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm">
            Built for Digital Heroes
          </Button>
        </a>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
          >
            My Info
          </Button>

          <div
            className={`absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-lg border border-border bg-surface shadow-lg transition-all duration-300 ${
              showInfo
                ? 'max-h-40 opacity-100'
                : 'max-h-0 opacity-0 border-transparent'
            }`}
          >
            <div className="p-3">
              <div className="font-medium text-text-primary">
                Hemendra Roy
              </div>
              <div className="mt-1 text-sm text-text-secondary">
                hemendraroy04@gmail.com
              </div>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

export function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full items-center justify-center bg-surface">
      <div className="text-sm text-text-secondary">Loading{dots}</div>
    </div>
  );
}
