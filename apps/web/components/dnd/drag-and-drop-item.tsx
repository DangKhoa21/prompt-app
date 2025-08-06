import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableItem({
  itemId,
  children,
  className,
}: {
  itemId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "text-card-foreground cursor-pointer flex items-center justify-between",
        className,
      )}
    >
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        className="w-8 h-8"
      >
        <GripVertical className="w-4 h-4 shrink-0 focus:outline-none "></GripVertical>
      </Button>
      {children}
    </div>
  );
}
