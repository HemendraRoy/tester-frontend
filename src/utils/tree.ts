import type { Folder, Request, TreeNode } from '../types';

export function buildTree(folders: Folder[], requests: Request[]): TreeNode[] {
  const folderMap = new Map<string, TreeNode>();

  for (const folder of folders) {
    folderMap.set(folder.id, {
      id: folder.id,
      type: 'folder',
      name: folder.name,
      parentId: folder.parentId,
      children: [],
    });
  }

  for (const request of requests) {
    const parent = folderMap.get(request.folderId);
    if (parent) {
      parent.children!.push({
        id: request.id,
        type: 'request',
        name: request.name,
        parentId: request.folderId,
      });
    }
  }

  const rootNodes: TreeNode[] = [];

  for (const node of folderMap.values()) {
    if (node.parentId === null) {
      rootNodes.push(node);
    } else {
      const parent = folderMap.get(node.parentId);
      if (parent) {
        parent.children!.push(node);
      }
    }
  }

  sortTreeNodes(rootNodes);
  return rootNodes;
}

function sortTreeNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const node of nodes) {
    if (node.children) sortTreeNodes(node.children);
  }
}

export function findRootFolderId(folders: Folder[]): string | null {
  const root = folders.find((f) => f.parentId === null);
  return root?.id ?? null;
}

export async function ensureRootFolder(
  folders: Folder[],
  addFolder: (name: string, parentId: string | null) => Promise<Folder>,
): Promise<string> {
  const existing = findRootFolderId(folders);
  if (existing) return existing;
  const root = await addFolder('My Collection', null);
  return root.id;
}

export function getRequestById(requests: Request[], id: string): Request | undefined {
  return requests.find((r) => r.id === id);
}
