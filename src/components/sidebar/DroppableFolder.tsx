import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../utils/helpers';

interface DroppableFolderProps {
  folderId: string;
  children: React.ReactNode;
}

export function DroppableFolder({ folderId, children }: DroppableFolderProps) {
  const { isOver, setNodeRef } = useDroppable({ id: folderId });

  return (
    <div
      ref={setNodeRef}
      className={cn(isOver && 'rounded bg-accent/10 ring-1 ring-accent/30')}
    >
      {children}
    </div>
  );
}
