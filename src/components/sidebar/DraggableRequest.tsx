import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableRequestProps {
  requestId: string;
  children: React.ReactNode;
}

export function DraggableRequest({ requestId, children }: DraggableRequestProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: requestId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
