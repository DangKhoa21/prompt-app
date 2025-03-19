import SortableItem from "@/components/dnd/drag-and-drop-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTemplate } from "@/context/template-context";
import { TemplateConfigValue } from "@/services/prompt/interface";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function ConfigItem({ value }: { value: TemplateConfigValue }) {
  const [itemName, setItemName] = useState(value.value);

  const [isEditName, setIsEditName] = useState(false);

  const itemNameInputRef = useRef<HTMLInputElement>(null);

  const { template, setTemplate } = useTemplate();

  const handleRenameConfigValue = () => {
    let check = true;
    template.configs.forEach((config) => {
      if (config.id === value.promptConfigId) {
        config.values.forEach((oldValue) => {
          if (oldValue.id !== value.id && oldValue.value === itemName) {
            toast.error(
              "You already have the same config value, please change it to other value",
            );
            check = false;
            return;
          }
        });
      }
    });
    if (!check) return;

    const newTemplate = {
      ...template,
      configs: template.configs.map((config) => {
        if (config.id === value.promptConfigId) {
          const newValues = config.values.map((oldValue) => {
            if (oldValue.id === value.id) {
              oldValue.value = itemName;
            }
            return oldValue;
          });

          config.values = newValues;
          return config;
        } else {
          return config;
        }
      }),
    };

    setTemplate(newTemplate);
    setIsEditName(false);
  };

  const handleDeleteConfigValue = () => {
    const newTemplate = {
      ...template,
      configs: template.configs.map((config) =>
        config.id === value.promptConfigId
          ? {
              ...config,
              values: (config.values ?? []).filter(
                (oldValue) => oldValue.id !== value.id,
              ),
            }
          : config,
      ),
    };

    setTemplate(newTemplate);
  };

  return (
    <SortableItem itemId={value.id}>
      {isEditName ? (
        <Input
          ref={itemNameInputRef}
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
          onBlur={() => {
            handleRenameConfigValue();
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === "Escape") {
              e.preventDefault();
              handleRenameConfigValue();
            }
          }}
          className=""
        ></Input>
      ) : (
        <div className="group flex justify-between h-8 w-full text-sm items-center">
          <div
            onClick={() => {
              setIsEditName(true);
              setTimeout(() => itemNameInputRef.current?.focus(), 0);
            }}
            className="h-8 flex items-center text-l font-semibold p-1 w-full text-wrap hover:bg-accent"
          >
            {value.value}
          </div>
          <Button
            variant="ghost"
            className="w-6 h-8 opacity-0 -translate-x-4 transition ease-in-out delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            onClick={() => handleDeleteConfigValue()}
          >
            <X />
          </Button>
        </div>
      )}
    </SortableItem>
  );
}

interface ConfigItemProps {
  id: string;
  values: TemplateConfigValue[];
}

export default function ConfigDnD({ id, values }: ConfigItemProps) {
  const { template, setTemplate } = useTemplate();

  const sortableItems = values
    ? values.map((pack) => ({
        id: pack.id,
        data: pack,
      }))
    : [];

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      const newOrder = template.configs.filter((config) => config.id === id)[0];

      const oldIndex = newOrder.values.findIndex(
        (value) => `${value.id}` === active.id,
      );
      const newIndex = newOrder.values.findIndex(
        (value) => `${value.id}` === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedItem] = newOrder.values.splice(oldIndex, 1);
        newOrder.values.splice(newIndex, 0, movedItem);
      }

      const newTemplate = {
        ...template,
        configs: template.configs.map((config) => {
          if (config.id === id) {
            config = newOrder;
          }
          return config;
        }),
      };

      setTemplate(newTemplate);
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
            {sortableItems.length ? (
              sortableItems.map((item) => (
                <ConfigItem key={item.id} value={item.data}></ConfigItem>
              ))
            ) : (
              <div className="mx-auto my-2 flex items-center justify-center">
                Currently empty
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
