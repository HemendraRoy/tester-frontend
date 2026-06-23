import { AppHeader } from './AppHeader';
import { Sidebar, ResizableLayout } from './Sidebar';
import { Workspace } from './Workspace';

export function AppLayout() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <ResizableLayout sidebar={<Sidebar />} workspace={<Workspace />} />
    </div>
  );
}
