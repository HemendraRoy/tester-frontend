import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean;
}

export function Input({ className, mono, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded border border-border bg-surface-secondary px-3 py-1.5',
        'text-sm text-text-primary placeholder:text-text-muted',
        'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
        'transition-colors',
        mono && 'font-mono',
        className,
      )}
      {...props}
    />
  );
}
