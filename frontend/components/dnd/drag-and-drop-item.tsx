import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableItem({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
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
      className="bg-card text-card-foreground rounded-md shadow-md cursor-pointer flex items-center justify-between"
    >
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        className="w-6 h-8"
      >
        <GripVertical className="w-4 h-4 shrink-0 focus:outline-none "></GripVertical>
      </Button>
      {children}
    </div>
  );
}
