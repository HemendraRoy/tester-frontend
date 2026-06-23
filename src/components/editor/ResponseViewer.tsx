import { useState } from 'react';
import { useActiveRequestStore } from '../../stores/activeRequestStore';
import { formatJson, getStatusColor, isJsonBody } from '../../utils/api';
import { cn } from '../../utils/helpers';
import { Tabs } from '../ui/Tabs';

const RESPONSE_TABS = [
  { id: 'body', label: 'Body' },
  { id: 'headers', label: 'Headers' },
];

export function ResponseViewer() {
  const response = useActiveRequestStore((s) => s.response);
  const isSending = useActiveRequestStore((s) => s.isSending);
  const [activeTab, setActiveTab] = useState('body');

  if (isSending) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-secondary">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
          Waiting for response...
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-secondary">
        <p className="text-sm text-text-muted">Send a request to see the response here</p>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex h-full flex-col bg-surface-secondary">
        <div className="border-b border-border px-4 py-2">
          <span className="text-sm font-medium text-red-500">Error</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">{response.error}</pre>
        </div>
      </div>
    );
  }

  const bodyContent = isJsonBody(response.body)
    ? formatJson(response.body)
    : typeof response.body === 'string'
      ? response.body
      : String(response.body ?? '');

  return (
    <div className="flex h-full flex-col bg-surface-secondary">
      <div className="flex items-center gap-4 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-bold', getStatusColor(response.status))}>
            {response.status}
          </span>
          <span className="text-sm text-text-secondary">{response.statusText}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {response.duration} ms
        </div>
      </div>

      <Tabs tabs={RESPONSE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'body' ? (
          <pre className="whitespace-pre-wrap p-4 font-mono text-sm text-text-primary">{bodyContent}</pre>
        ) : (
          <div className="p-4">
            {Object.entries(response.headers).length === 0 ? (
              <p className="text-sm text-text-muted">No response headers</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="py-1.5 pr-4 font-mono font-medium text-text-primary">{key}</td>
                      <td className="py-1.5 font-mono text-text-secondary">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
