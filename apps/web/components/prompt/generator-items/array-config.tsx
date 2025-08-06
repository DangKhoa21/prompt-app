import SortableItem from "@/components/dnd/drag-and-drop-item";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v7 } from "uuid";

function ArrayAccordionItem({
  itemId,
  labels,
  values,
  isDraging,
  handleTextareaChange,
  handleDeleteItem,
}: {
  itemId: string;
  itemGivenName?: string;
  labels: string[];
  values: string[];
  isDraging: boolean;
  handleTextareaChange: (id: string, label: number, value: string) => void;
  handleDeleteItem: (itemId: string) => void;
}) {
  const [localIsOpen, setIsOpen] = useState(false);
  const isOpen = !isDraging && localIsOpen;

  const inputRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Auto focus the first input fields
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        inputRef.current["el_0"]?.setSelectionRange(
          values[0].length,
          values[0].length,
        );
        inputRef.current["el_0"]?.focus();
      }, 300);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOpen, values]);

  return (
    <div className={cn(isOpen && "border-2 rounded-md p-1")}>
      <SortableItem
        itemId={itemId}
        className={cn(!isOpen && "border-2 rounded-md p-1")}
      >
        <div className="flex w-full justify-between">
          <div
            className="flex w-full h-full min-h-8 text-wrap gap-1 overflow-hidden justify-between items-center truncate hover:bg-accent"
            onClick={() => setIsOpen(!localIsOpen)}
          >
            {!isOpen ? (
              values.length ? (
                <div className="flex flex-col gap-1">
                  {values.map((value, index) => (
                    <div key={`item-${index}`} className="line-clamp-2">
                      <span className="text-sm font-semibold">
                        {labels[index][0].toUpperCase()}
                        {labels[index].slice(1)}:
                      </span>{" "}
                      {value}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-destructive-foreground">
                  This config does not have any values
                </div>
              )
            ) : (
              <div>Opened</div>
            )}
          </div>
          {isOpen && (
            <Button
              variant="ghost"
              className="w-8 h-8"
              onClick={() => {
                const id = itemId.split("-").slice(1).join("-");
                handleDeleteItem(id);
              }}
            >
              <X />
            </Button>
          )}
        </div>
      </SortableItem>
      {isOpen && (
        <ScrollArea className="h-full w-full">
          {values.length ? (
            <div className="flex flex-col gap-2 p-1">
              {values.map((value, index) => (
                <div
                  key={`Card-${itemId}-${labels[index]}`}
                  className="w-full flex flex-col justify-between gap-2"
                >
                  <div className="text-sm font-semibold">
                    {labels[index][0].toUpperCase()}
                    {labels[index].slice(1)}:
                  </div>
                  <Textarea
                    ref={(el) => {
                      inputRef.current[`el_${index}`] = el;
                    }}
                    placeholder={labels[index]}
                    className="min-h-[100px] border border-slate-500"
                    value={value}
                    onChange={(e) => {
                      handleTextareaChange(itemId, index, e.target.value);
                    }}
                  ></Textarea>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col mt-2 items-center">
              This config has no keys
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

interface ArrayConfigProps {
  id: string;
  labels: string[];
  values: { id: string; values: string[] }[];
  setArrayValues: Dispatch<
    SetStateAction<Record<string, { id: string; values: string[] }[]>>
  >;
}

export function ArrayConfig({
  id,
  labels,
  values,
  setArrayValues,
}: ArrayConfigProps) {
  const [isDraging, setIsDraging] = useState<boolean>(false);

  const handleAddItems = () => {
    setArrayValues((prevState) => ({
      ...prevState,
      [id]: [
        ...(prevState[id] ?? []),
        {
          id: v7(),
          values: labels.map((label) => `${label}`),
        },
      ],
    }));
  };

  const sortableItems = values
    ? values.map((pack) => ({
        id: `${id}-${pack.id}`,
        data: pack.values,
      }))
    : [];

  const handleTextareaChange = (
    itemId: string,
    labelIndex: number,
    value: string,
  ) => {
    setArrayValues((prevState) => {
      const newArray = (prevState[id] ?? []).map((item) => {
        if (item.id === itemId.split("-").slice(1).join("-")) {
          const newValues = item.values;
          newValues[labelIndex] = value;

          return {
            id: item.id,
            values: newValues,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      return {
        ...prevState,
        [id]: newArray,
      };
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setArrayValues((prevState) => {
      const newArray = prevState[id].filter((item) => item.id !== itemId);

      return {
        ...prevState,
        [id]: newArray,
      };
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    setIsDraging(true);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    setIsDraging(false);

    if (active.id !== over.id) {
      setArrayValues((prev) => {
        const newOrder = [...prev[id]];
        const oldIndex = newOrder.findIndex(
          (value) => `${id}-${value.id}` === active.id,
        );
        const newIndex = newOrder.findIndex(
          (value) => `${id}-${value.id}` === over.id,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const [movedItem] = newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, movedItem);
        }

        return { ...prev, [id]: newOrder };
      });
    }
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={sortableItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortableItems.length ? (
              sortableItems.map((item) => (
                <ArrayAccordionItem
                  key={item.id}
                  itemId={item.id}
                  labels={labels}
                  values={item.data}
                  isDraging={isDraging}
                  handleTextareaChange={handleTextareaChange}
                  handleDeleteItem={handleDeleteItem}
                ></ArrayAccordionItem>
              ))
            ) : (
              <div className="text-center my-2 text-muted-foreground">
                Empty
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Button className="w-full mt-4" onClick={handleAddItems}>
        <Plus />
        Add new item
      </Button>
    </>
  );
}
