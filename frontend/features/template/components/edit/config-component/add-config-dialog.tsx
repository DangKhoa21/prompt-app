"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplate } from "@/context/template-context";
import { ConfigDnD } from "@/features/template";
import { TemplateConfigValue } from "@/services/prompt/interface";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { v7 } from "uuid";

interface AddConfigDialogProps {
  id: string;
  label: string;
  values: TemplateConfigValue[];
}

export function AddConfigDialog({ id, label, values }: AddConfigDialogProps) {
  const [newConfigValue, setNewConfigValue] = useState("");
  const [latestAdded, setLatestAdded] = useState("");
  const [addingError, setAddingError] = useState("");
  const { template, setTemplate } = useTemplate();

  const handleAddConfigValue = useCallback(
    (event: React.FormEvent | React.KeyboardEvent, configId: string) => {
      event.preventDefault();

      const value = newConfigValue;

      if (!value) {
        setAddingError("Value should not be empty");
        return;
      }
      if (values.some((config) => config.value === value)) {
        setAddingError(`Already have config name: "${value}"`);
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        setAddingError("Only alphanumeric, underscore and dash are allowed");
        return;
      }

      const newTemplate = {
        ...template,
        configs: template.configs.map((config) =>
          config.id === configId
            ? {
                ...config,
                values: [
                  ...(config.values ?? []),
                  { id: v7(), value: value, promptConfigId: id },
                ],
              }
            : config,
        ),
      };

      setTemplate(newTemplate);
      setLatestAdded(value);
      setNewConfigValue("");
    },
    [id, newConfigValue, setTemplate, template, values],
  );

  return (
    <>
      <div className="flex justify-between items-center h-10">
        <p className="text-sm text-gray-600">[{label}] values</p>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" className="-mr-2">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adding new value for {label}</DialogTitle>
              <DialogDescription>
                Let&apos;s add new value to your config.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newValue" className="text-right">
                  Value
                </Label>
                <Input
                  id="newValue"
                  value={newConfigValue}
                  onChange={(e) => {
                    setNewConfigValue(e.target.value);
                    setLatestAdded("");
                    setAddingError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddConfigValue(e, id);
                    }
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            {latestAdded && (
              <div className="flex justify-center text-green-500">
                Added: {latestAdded}
              </div>
            )}
            {addingError && (
              <div className="flex justify-center text-destructive">
                Error: {addingError}
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                onClick={(e) => handleAddConfigValue(e, id)}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px] border rounded-md p-2">
        <ConfigDnD id={id} values={values} />
      </ScrollArea>
    </>
  );
}
