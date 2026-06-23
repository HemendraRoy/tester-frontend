import { cn } from '../../utils/helpers';
import { Button } from './Button';

interface KeyValueEditorProps {
  pairs: { key: string; value: string }[];
  onChange: (pairs: { key: string; value: string }[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueEditorProps) {
  const updatePair = (index: number, field: 'key' | 'value', value: string) => {
    const updated = pairs.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  const addRow = () => {
    onChange([...pairs, { key: '', value: '' }]);
  };

  const removeRow = (index: number) => {
    if (pairs.length <= 1) {
      onChange([{ key: '', value: '' }]);
      return;
    }
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-1 p-4">
      <div className="mb-2 grid grid-cols-[1fr_1fr_32px] gap-2 text-xs font-medium text-text-muted">
        <span>{keyPlaceholder}</span>
        <span>{valuePlaceholder}</span>
        <span />
      </div>
      {pairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-2">
          <input
            value={pair.key}
            onChange={(e) => updatePair(index, 'key', e.target.value)}
            placeholder={keyPlaceholder}
            className={cn(
              'rounded border border-border bg-surface-secondary px-2 py-1.5',
              'font-mono text-sm text-text-primary placeholder:text-text-muted',
              'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
            )}
          />
          <input
            value={pair.value}
            onChange={(e) => updatePair(index, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className={cn(
              'rounded border border-border bg-surface-secondary px-2 py-1.5',
              'font-mono text-sm text-text-primary placeholder:text-text-muted',
              'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
            )}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeRow(index)}
            className="!px-1 text-text-muted hover:text-red-500"
            title="Remove row"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={addRow} className="mt-2 self-start">
        + Add Row
      </Button>
    </div>
  );
}
