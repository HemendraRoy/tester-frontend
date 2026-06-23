import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SidebarTree } from '../sidebar/SidebarTree';

export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-surface-secondary">
      <SidebarTree />
    </div>
  );
}

export function ResizableLayout({ sidebar, workspace }: { sidebar: React.ReactNode; workspace: React.ReactNode }) {
  return (
    <PanelGroup direction="horizontal" className="flex-1">
      <Panel defaultSize={25} minSize={15} maxSize={40} className="overflow-hidden">
        {sidebar}
      </Panel>
      <PanelResizeHandle className="group w-1 bg-border transition-colors hover:bg-accent/50">
        <div className="mx-auto h-full w-0.5 bg-transparent group-hover:bg-accent/30" />
      </PanelResizeHandle>
      <Panel minSize={40} className="overflow-hidden">
        {workspace}
      </Panel>
    </PanelGroup>
  );
}
