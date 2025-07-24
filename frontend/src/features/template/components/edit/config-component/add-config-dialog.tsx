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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplate } from "@/context/template-context";
import { ConfigDnD } from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { TemplateConfigValue } from "@/services/prompt/interface";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddConfigValue = useCallback(
    (event: React.FormEvent | React.KeyboardEvent) => {
      event.preventDefault();

      if (!newConfigValue) {
        setAddingError("Value should not be empty");
        return;
      }
      if (values.some((config) => config.value === newConfigValue)) {
        setAddingError(`Already have config name: "${newConfigValue}"`);
        return;
      }
      if (!/^[a-zA-Z0-9_ -]+$/.test(newConfigValue)) {
        setAddingError(
          "Only alphanumeric characters, spaces, underscore, and dash are allowed",
        );
        return;
      }

      const newTemplate = {
        ...template,
        configs: template.configs.map((config) =>
          config.id === id
            ? {
                ...config,
                values: [
                  ...(config.values ?? []),
                  { id: v7(), value: newConfigValue, promptConfigId: id },
                ],
              }
            : config,
        ),
      };

      setTemplate(newTemplate);
      setLatestAdded(newConfigValue);
      setNewConfigValue("");
    },
    [id, newConfigValue, setTemplate, template, values],
  );

  return (
    <>
      <div className="flex justify-between items-center h-10">
        <p className="text-sm text-gray-600">[{label}] values</p>
        <AddNewValue
          isMobile={isMobile}
          open={open}
          setOpen={setOpen}
          label={label}
          handleAddConfigValue={handleAddConfigValue}
          newConfigValue={newConfigValue}
          setNewConfigValue={setNewConfigValue}
          latestAdded={latestAdded}
          addingError={addingError}
          setAddingError={setAddingError}
          setLatestAdded={setLatestAdded}
        />
      </div>
      <ScrollArea className="h-[300px] border rounded-md p-2">
        <ConfigDnD id={id} values={values} />
      </ScrollArea>
    </>
  );
}

function AddNewValue({
  isMobile,
  open,
  setOpen,
  label,
  handleAddConfigValue,
  newConfigValue,
  setNewConfigValue,
  latestAdded,
  addingError,
  setAddingError,
  setLatestAdded,
}: {
  isMobile: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  label: string;
  handleAddConfigValue: (event: React.FormEvent | React.KeyboardEvent) => void;
  newConfigValue: string;
  setNewConfigValue: Dispatch<SetStateAction<string>>;
  latestAdded: string;
  addingError: string;
  setAddingError: Dispatch<SetStateAction<string>>;
  setLatestAdded: Dispatch<SetStateAction<string>>;
}) {
  const content = (
    <>
      <AddingForm
        newConfigValue={newConfigValue}
        setNewConfigValue={setNewConfigValue}
        latestAdded={latestAdded}
        addingError={addingError}
        setAddingError={setAddingError}
        setLatestAdded={setLatestAdded}
      />
    </>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
          {content}
          <DialogFooter>
            <Button type="submit" onClick={handleAddConfigValue}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="-mr-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Adding new value for {label}</DrawerTitle>
          <DrawerDescription>
            Let&apos;s add new value to your config.
          </DrawerDescription>
        </DrawerHeader>
        {content}
        <DrawerFooter className="pt-2 flex flex-row-reverse items-center justify-between">
          <Button type="submit" onClick={handleAddConfigValue}>
            Add
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddingForm({
  newConfigValue,
  setNewConfigValue,
  latestAdded,
  addingError,
  setLatestAdded,
  setAddingError,
}: {
  newConfigValue: string;
  setNewConfigValue: Dispatch<SetStateAction<string>>;
  latestAdded: string;
  addingError: string;
  setLatestAdded: Dispatch<SetStateAction<string>>;
  setAddingError: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-5 items-center gap-4 px-2">
          <Label htmlFor="newValue" className="text-right">
            Value
          </Label>
          <Input
            id="newValue"
            value={newConfigValue}
            autoFocus
            onChange={(e) => {
              setNewConfigValue(e.target.value);
              setLatestAdded("");
              setAddingError("");
            }}
            className="col-span-4"
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
    </>
  );
}
