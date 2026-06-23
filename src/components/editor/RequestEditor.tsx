import { useCallback } from 'react';
import type { Request, HttpMethod, EditorTab } from '../../types';
import { HTTP_METHODS } from '../../types';
import { useRequestStore } from '../../stores/requestStore';
import { useActiveRequestStore } from '../../stores/activeRequestStore';
import { persistUIState } from '../../stores/uiStore';
import { executeRequest } from '../../utils/api';
import { buildUrlWithParams, keyValuePairsToRecord } from '../../utils/helpers';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { KeyValueEditor } from '../ui/KeyValueEditor';
import { cn } from '../../utils/helpers';
import { getMethodColor } from '../../utils/api';

interface RequestEditorProps {
  request: Request;
}

const EDITOR_TABS = [
  { id: 'params', label: 'Params' },
  { id: 'headers', label: 'Headers' },
  { id: 'body', label: 'Body' },
];

export function RequestEditor({ request }: RequestEditorProps) {
  const updateRequest = useRequestStore((s) => s.updateRequest);
  const activeTab = useActiveRequestStore((s) => s.activeTab);
  const setActiveTab = useActiveRequestStore((s) => s.setActiveTab);
  const setResponse = useActiveRequestStore((s) => s.setResponse);
  const isSending = useActiveRequestStore((s) => s.isSending);
  const setIsSending = useActiveRequestStore((s) => s.setIsSending);

  const handleFieldChange = useCallback(
    (field: keyof Request, value: unknown) => {
      updateRequest(request.id, { [field]: value });
    },
    [request.id, updateRequest],
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as EditorTab);
    persistUIState();
  };

  const handleSend = async () => {
    if (!request.url.trim()) return;

    setIsSending(true);
    setResponse(null);

    const url = buildUrlWithParams(request.url, request.params);
    const headers = keyValuePairsToRecord(request.headers);
    const hasBody = !['GET'].includes(request.method);

    const result = await executeRequest({
      method: request.method,
      url,
      headers,
      body: hasBody && request.body ? request.body : null,
    });

    setResponse(result);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Select
          value={request.method}
          onChange={(e) => handleFieldChange('method', e.target.value as HttpMethod)}
          className={cn('w-28 font-bold', getMethodColor(request.method))}
        >
          {HTTP_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Input
          value={request.url}
          onChange={(e) => handleFieldChange('url', e.target.value)}
          placeholder="Enter request URL"
          mono
          className="flex-1"
        />
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={isSending || !request.url.trim()}
          className="min-w-[80px]"
        >
          {isSending ? (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              Sending
            </span>
          ) : (
            'Send'
          )}
        </Button>
      </div>

      <Tabs tabs={EDITOR_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'params' && (
          <KeyValueEditor
            pairs={request.params}
            onChange={(pairs) => handleFieldChange('params', pairs)}
            keyPlaceholder="Parameter"
            valuePlaceholder="Value"
          />
        )}
        {activeTab === 'headers' && (
          <KeyValueEditor
            pairs={request.headers}
            onChange={(pairs) => handleFieldChange('headers', pairs)}
            keyPlaceholder="Header"
            valuePlaceholder="Value"
          />
        )}
        {activeTab === 'body' && (
          <div className="flex h-full flex-col p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-text-muted">Raw body (JSON supported)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(request.body), null, 2);
                    handleFieldChange('body', formatted);
                  } catch {
                    /* not valid JSON */
                  }
                }}
              >
                Format JSON
              </Button>
            </div>
            <textarea
              value={request.body}
              onChange={(e) => handleFieldChange('body', e.target.value)}
              placeholder='{"key": "value"}'
              className={cn(
                'min-h-[200px] flex-1 resize-none rounded border border-border bg-surface-secondary p-3',
                'font-mono text-sm text-text-primary placeholder:text-text-muted',
                'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
              )}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
