import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/helpers';
import { useRequestStore } from '../../stores/requestStore';
import { getMethodColor } from '../../utils/api';
import { useUIStore } from '../../stores/uiStore';
import { useActiveRequestStore } from '../../stores/activeRequestStore';
import { useFolderStore } from '../../stores/folderStore';
import { persistUIState } from '../../stores/uiStore';
import { TreeNodeRenderer } from './TreeNodeRenderer';
import type { TreeNode } from '../../types';

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void;
}

export function TreeItem({ node, depth, onContextMenu }: TreeItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const activeRequestId = useActiveRequestStore((s) => s.activeRequestId);
  const setActiveRequest = useActiveRequestStore((s) => s.setActiveRequest);
  const expandedFolders = useUIStore((s) => s.expandedFolders);
  const toggleFolderExpanded = useUIStore((s) => s.toggleFolderExpanded);
  const renamingId = useUIStore((s) => s.renamingId);
  const setRenamingId = useUIStore((s) => s.setRenamingId);
  const updateFolder = useFolderStore((s) => s.updateFolder);
  const updateRequest = useRequestStore((s) => s.updateRequest);
  const addFolder = useFolderStore((s) => s.addFolder);
  const addRequest = useRequestStore((s) => s.addRequest);
  const expandFolder = useUIStore((s) => s.expandFolder);
  const requests = useRequestStore((s) => s.requests);

  const inputRef = useRef<HTMLInputElement>(null);
  const isExpanded = expandedFolders.has(node.id);
  const isActive = node.type === 'request' && activeRequestId === node.id;
  const isRenaming = renamingId === node.id;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolderExpanded(node.id);
    } else {
      setActiveRequest(node.id);
      persistUIState();
    }
  };

  const handleRename = useCallback(
    async (newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed) {
        setRenamingId(null);
        return;
      }
      if (node.type === 'folder') {
        await updateFolder(node.id, { name: trimmed });
      } else {
        await updateRequest(node.id, { name: trimmed });
      }
      setRenamingId(null);
    },
    [node, updateFolder, updateRequest, setRenamingId],
  );

  const handleAddFolder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    expandFolder(node.id);
    const folder = await addFolder('New Folder', node.id);
    setRenamingId(folder.id);
  };

  const handleAddRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    expandFolder(node.id);
    const request = await addRequest(node.id);
    setActiveRequest(request.id);
    persistUIState();
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContextMenu(e, node);
  };

  return (
    <>
      <div
        className={cn(
          'group relative flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm',
          'transition-colors select-none',
          isActive
            ? 'bg-accent/15 text-accent'
            : 'text-text-primary hover:bg-surface-tertiary',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, node);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {node.type === 'folder' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={cn('shrink-0 transition-transform text-text-muted', isExpanded && 'rotate-90')}
            fill="currentColor"
          >
            <path d="M4 2l4 4-4 4V2z" />
          </svg>
        )}

        {node.type === 'folder' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-yellow-500">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        ) : (
          <span
            className={cn(
              'shrink-0 text-[10px] font-bold uppercase',
              getMethodColor(requests.find((r) => r.id === node.id)?.method ?? 'GET'),
            )}
          >
            •
          </span>
        )}

        {isRenaming ? (
          <input
            ref={inputRef}
            defaultValue={node.name}
            className="min-w-0 flex-1 rounded border border-accent bg-surface px-1 py-0 text-sm outline-none"
            onBlur={(e) => handleRename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename(e.currentTarget.value);
              if (e.key === 'Escape') setRenamingId(null);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate">{node.name}</span>
        )}

        {node.type === 'folder' && isHovered && !isRenaming && (
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={handleAddFolder}
              className="rounded p-0.5 text-text-muted hover:bg-surface hover:text-text-primary"
              title="Add Folder"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
            <button
              onClick={handleAddRequest}
              className="rounded p-0.5 text-text-muted hover:bg-surface hover:text-text-primary"
              title="Add Request"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
              onClick={handleMoreClick}
              className="rounded p-0.5 text-text-muted hover:bg-surface hover:text-text-primary"
              title="More"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </div>
        )}

        {node.type === 'request' && isHovered && !isRenaming && (
          <button
            onClick={handleMoreClick}
            className="shrink-0 rounded p-0.5 text-text-muted hover:bg-surface hover:text-text-primary"
            title="More"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        )}
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeRenderer
              key={child.id}
              node={child}
              depth={depth + 1}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  );
}
