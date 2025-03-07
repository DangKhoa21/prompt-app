import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function SortableItem({
  id,
  labels,
  values,
  handleTextareaChange,
}: {
  id: string;
  labels: string[];
  values: string[];
  handleTextareaChange: (
    valueIndex: number,
    label: number,
    value: string,
  ) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const valueIndex = parseInt(id.split("-")[1]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-2 bg-card text-card-foreground rounded-md shadow-md cursor-pointer flex items-center justify-between"
    >
      <GripVertical
        {...attributes}
        {...listeners}
        className="w-4 h-4 mr-2 shrink-0 focus:outline-none "
      ></GripVertical>
      <Dialog>
        <DialogTrigger asChild>
          <div className="px-0 flex w-full gap-2 overflow-hidden justify-between hover:bg-card/90 focus:bg-card/90">
            <div className="truncate">{id}</div>
            <Badge className="mr-1">View</Badge>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
          {values.map((value, index) => (
            <>
              <Card
                key={`${id}-${valueIndex}-${labels[index]}`}
                className="border border-slate-500"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {labels[index]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={labels[index]}
                    className="min-h-[200px] border border-slate-500"
                    value={value}
                    onChange={(e) => {
                      handleTextareaChange(valueIndex, index, e.target.value);
                    }}
                  />
                </CardContent>
              </Card>
            </>
          ))}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ArrayConfigProps {
  id: string;
  labels: string[];
  values: string[][];
  setArrayValues: Dispatch<SetStateAction<Record<string, string[][]>>>;
}

export function ArrayConfig({
  id,
  labels,
  values,
  setArrayValues,
}: ArrayConfigProps) {
  const handleAddItems = () => {
    setArrayValues((prevState) => ({
      ...prevState,
      [id]: [...(prevState[id] ?? []), labels.map((label) => `${label}`)],
    }));
  };

  const sortableItems = values
    ? values.map((pack, index) => ({
        id: `${id}-${index}`,
        data: pack,
      }))
    : [];

  console.log(
    `Sortable items: ${sortableItems ? sortableItems.map((item) => [item.id, item.data]) : "Empty"}`,
  );

  const handleTextareaChange = (
    valueIndex: number,
    labelIndex: number,
    value: string,
  ) => {
    setArrayValues((prevState) => {
      const newArray = prevState[id];

      newArray[valueIndex][labelIndex] = value;

      return {
        ...prevState,
        [id]: newArray,
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id !== over.id) {
      setArrayValues((prev) => {
        const newOrder = [...prev.Detail];
        const oldIndex = newOrder.findIndex(
          (_, i) => `${id}-${i}` === active.id,
        );
        const newIndex = newOrder.findIndex((_, i) => `${id}-${i}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const [movedItem] = newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, movedItem);
        }

        return { ...prev, Detail: newOrder };
      });
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={sortableItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortableItems.length
              ? sortableItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    labels={labels}
                    values={item.data}
                    handleTextareaChange={handleTextareaChange}
                  />
                ))
              : "Empty"}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={handleAddItems}>
          <Plus></Plus>
        </Button>
      </div>
    </>
  );
}
