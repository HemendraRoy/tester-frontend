import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingScreen } from './components/layout/AppHeader';
import { initializeDatabase } from './db';
import { useFolderStore } from './stores/folderStore';
import { useRequestStore } from './stores/requestStore';
import { useUIStore } from './stores/uiStore';
import { ensureRootFolder } from './utils/tree';

export function App() {
  const isInitialized = useUIStore((s) => s.isInitialized);
  const initialize = useUIStore((s) => s.initialize);
  const loadFolders = useFolderStore((s) => s.loadFolders);
  const loadRequests = useRequestStore((s) => s.loadRequests);
  const folders = useFolderStore((s) => s.folders);
  const foldersLoaded = useFolderStore((s) => s.isLoaded);
  const requestsLoaded = useRequestStore((s) => s.isLoaded);
  const addFolder = useFolderStore((s) => s.addFolder);

  useEffect(() => {
    async function init() {
      await initializeDatabase();
      await Promise.all([loadFolders(), loadRequests()]);
      await initialize();
    }
    init();
  }, [initialize, loadFolders, loadRequests]);

  useEffect(() => {
    if (foldersLoaded && folders.length === 0) {
      ensureRootFolder(folders, addFolder);
    }
  }, [foldersLoaded, folders, addFolder]);

  if (!isInitialized || !foldersLoaded || !requestsLoaded) {
    return <LoadingScreen />;
  }

  return <AppLayout />;
}
