import { TreeItem } from './TreeItem';
import { DraggableRequest } from './DraggableRequest';
import { DroppableFolder } from './DroppableFolder';
import type { TreeNode } from '../../types';

interface TreeNodeRendererProps {
  node: TreeNode;
  depth: number;
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void;
}

export function TreeNodeRenderer({ node, depth, onContextMenu }: TreeNodeRendererProps) {
  if (node.type === 'request') {
    return (
      <DraggableRequest requestId={node.id}>
        <TreeItem node={node} depth={depth} onContextMenu={onContextMenu} />
      </DraggableRequest>
    );
  }

  return (
    <DroppableFolder folderId={node.id}>
      <TreeItem node={node} depth={depth} onContextMenu={onContextMenu} />
    </DroppableFolder>
  );
}
