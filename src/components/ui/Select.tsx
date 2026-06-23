import { cn } from '../../utils/helpers';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'rounded border border-border bg-surface-secondary px-2 py-1.5',
        'text-sm font-medium text-text-primary',
        'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
        'cursor-pointer transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
