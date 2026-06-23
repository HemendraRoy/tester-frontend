import { useMemo, useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useFolderStore } from '../../stores/folderStore';
import { useRequestStore } from '../../stores/requestStore';
import { useUIStore } from '../../stores/uiStore';
import { useActiveRequestStore } from '../../stores/activeRequestStore';
import { buildTree } from '../../utils/tree';
import { TreeNodeRenderer } from './TreeNodeRenderer';
import { ContextMenu } from '../ui/ContextMenu';
import { Button } from '../ui/Button';
import { persistUIState } from '../../stores/uiStore';
import type { TreeNode } from '../../types';

export function SidebarTree() {
  const folders = useFolderStore((s) => s.folders);
  const requests = useRequestStore((s) => s.requests);
  const addFolder = useFolderStore((s) => s.addFolder);
  const addRequest = useRequestStore((s) => s.addRequest);
  const deleteFolder = useFolderStore((s) => s.deleteFolder);
  const deleteRequest = useRequestStore((s) => s.deleteRequest);
  const moveRequest = useRequestStore((s) => s.moveRequest);
  const contextMenu = useUIStore((s) => s.contextMenu);
  const setContextMenu = useUIStore((s) => s.setContextMenu);
  const setRenamingId = useUIStore((s) => s.setRenamingId);
  const expandFolder = useUIStore((s) => s.expandFolder);
  const setActiveRequest = useActiveRequestStore((s) => s.setActiveRequest);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(folders, requests), [folders, requests]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, node: TreeNode) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id, nodeType: node.type });
    },
    [setContextMenu],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const requestId = active.id as string;
    const targetFolderId = over.id as string;

    const request = requests.find((r) => r.id === requestId);
    if (request && request.folderId !== targetFolderId) {
      moveRequest(requestId, targetFolderId);
      expandFolder(targetFolderId);
    }
  };

  const contextMenuItems = useMemo(() => {
    if (!contextMenu) return [];

    const { nodeId, nodeType } = contextMenu;

    if (nodeType === 'folder') {
      return [
        {
          label: 'Add Folder',
          onClick: async () => {
            expandFolder(nodeId);
            const folder = await addFolder('New Folder', nodeId);
            setRenamingId(folder.id);
          },
        },
        {
          label: 'Add Request',
          onClick: async () => {
            expandFolder(nodeId);
            const request = await addRequest(nodeId);
            setActiveRequest(request.id);
            persistUIState();
          },
        },
        { label: '', onClick: () => {}, divider: true },
        { label: 'Rename', onClick: () => setRenamingId(nodeId) },
        { label: 'Delete', onClick: () => deleteFolder(nodeId), danger: true },
      ];
    }

    return [
      { label: 'Rename', onClick: () => setRenamingId(nodeId) },
      { label: 'Delete', onClick: () => deleteRequest(nodeId), danger: true },
    ];
  }, [
    contextMenu,
    addFolder,
    addRequest,
    deleteFolder,
    deleteRequest,
    setRenamingId,
    expandFolder,
    setActiveRequest,
  ]);

  const handleAddRootFolder = async () => {
    const folder = await addFolder('New Folder', null);
    setRenamingId(folder.id);
  };

  const handleAddRootRequest = async () => {
    const rootFolder = folders.find((f) => f.parentId === null);
    if (!rootFolder) {
      const folder = await addFolder('My Collection', null);
      const request = await addRequest(folder.id);
      setActiveRequest(request.id);
      persistUIState();
      return;
    }
    const request = await addRequest(rootFolder.id);
    setActiveRequest(request.id);
    persistUIState();
  };

  const draggedRequest = activeDragId ? requests.find((r) => r.id === activeDragId) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Collections</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleAddRootFolder} title="New Folder" className="!p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddRootRequest} title="New Request" className="!p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            <p>No collections yet.</p>
            <Button variant="ghost" size="sm" onClick={handleAddRootFolder} className="mt-2">
              Create a folder
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {tree.map((node) => (
              <TreeNodeRenderer
                key={node.id}
                node={node}
                depth={0}
                onContextMenu={handleContextMenu}
              />
            ))}
            <DragOverlay>
              {draggedRequest && (
                <div className="rounded bg-surface-tertiary px-3 py-1.5 text-sm shadow-lg">
                  {draggedRequest.name}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
