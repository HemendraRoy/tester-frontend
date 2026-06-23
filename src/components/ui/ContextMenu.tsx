import { useEffect, useRef } from 'react';
import { cn } from '../../utils/helpers';

interface ContextMenuProps {
  x: number;
  y: number;
  items: { label: string; onClick: () => void; danger?: boolean; divider?: boolean }[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      if (rect.right > viewportW) {
        ref.current.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > viewportH) {
        ref.current.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="animate-fade-in fixed z-50 min-w-[180px] rounded-lg border border-border bg-surface py-1 shadow-xl"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="my-1 border-t border-border" />
        ) : (
          <button
            key={i}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={cn(
              'flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors',
              item.danger
                ? 'text-red-500 hover:bg-red-500/10'
                : 'text-text-primary hover:bg-surface-tertiary',
            )}
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
