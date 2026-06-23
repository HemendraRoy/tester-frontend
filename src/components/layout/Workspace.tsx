import { useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useActiveRequestStore } from '../../stores/activeRequestStore';
import { useRequestStore } from '../../stores/requestStore';
import { RequestEditor } from '../editor/RequestEditor';
import { ResponseViewer } from '../editor/ResponseViewer';
import { EmptyWorkspace } from './EmptyWorkspace';

export function Workspace() {
  const activeRequestId = useActiveRequestStore((s) => s.activeRequestId);
  const requests = useRequestStore((s) => s.requests);

  const activeRequest = useMemo(
    () => requests.find((r) => r.id === activeRequestId) ?? null,
    [requests, activeRequestId],
  );

  if (!activeRequest) {
    return <EmptyWorkspace />;
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <PanelGroup direction="vertical" className="flex-1">
        <Panel defaultSize={55} minSize={25}>
          <RequestEditor request={activeRequest} />
        </Panel>
        <PanelResizeHandle className="group h-1 bg-border transition-colors hover:bg-accent/50">
          <div className="mx-auto h-0.5 w-full bg-transparent group-hover:bg-accent/30" />
        </PanelResizeHandle>
        <Panel defaultSize={45} minSize={15}>
          <ResponseViewer />
        </Panel>
      </PanelGroup>
    </div>
  );
}
