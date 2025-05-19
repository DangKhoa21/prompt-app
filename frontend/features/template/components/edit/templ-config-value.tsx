"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTemplate } from "@/context/template-context";
import { ConfigType } from "@/features/template";
import { cn, parseInfo, stringifyInfo } from "@/lib/utils";
import { TemplateConfig } from "@/services/prompt/interface";
import { Plus } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";
import ConfigDnD from "./config-variable/config-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ConfigVariableProps extends TemplateConfig {
  index: number;
  isSidebarOpen?: boolean;
}

export function TemplatesConfigVariable({
  id,
  // index,
  label,
  type,
  info,
  values,
  isSidebarOpen,
}: ConfigVariableProps) {
  const [newConfigValue, setNewConfigValue] = useState("");
  const [latestAdded, setLatestAdded] = useState("");
  const [addingError, setAddingError] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const extractedInfo = parseInfo(info);

  const [isMandatory, setIsMandatory] = useState(extractedInfo.isRequired);
  const [description, setDescription] = useState(extractedInfo.description);

  const { template, setTemplate } = useTemplate();

  const handleSelectChange = (configId: string, type: ConfigType) => {
    const newTemplate = {
      ...template,
      configs: template.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              type: ConfigType[type.toUpperCase() as keyof typeof ConfigType],
            }
          : config,
      ),
    };

    setTemplate(newTemplate);
  };

  const handleAddConfigValue = (
    event: React.FormEvent | React.KeyboardEvent,
    configId: string,
  ) => {
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
  };

  const handleRequiredChange = () => {
    const newState = !isMandatory;

    const newTemplate = {
      ...template,
      configs: template.configs.map((config) =>
        config.id === id
          ? {
              ...config,
              info: stringifyInfo({ isRequired: newState, description: "" }),
            }
          : config,
      ),
    };

    setTemplate(newTemplate);
    setIsMandatory(newState);
  };

  // TODO: Smaller display on small devices (slide left to delete item instead of click)
  return (
    <Card key={id} className="border border-slate-500">
      <CardHeader
        className={cn("pt-6 pb-2 px-4", isSidebarOpen ? "md:px-6" : "lg:px-4")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <div>Config {label}</div>

          {!isOpen ? (
            <div className="italic text-sm font-thin cursor-default">
              Click for details
            </div>
          ) : (
            <div className="italic text-sm font-thin cursor-default">
              Click to hide
            </div>
          )}

          <Select
            onValueChange={(value) => {
              const handledValue =
                ConfigType[value.toUpperCase() as keyof typeof ConfigType];
              handleSelectChange(id, handledValue);
            }}
          >
            <SelectTrigger id={type.toString()} className="max-w-36">
              <SelectValue
                placeholder={`${type[0].toUpperCase()}${type.slice(1)}`}
              />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ConfigType)
                .filter((value) => isNaN(Number(value)))
                .map((config) => (
                  <SelectItem key={config} value={config.toString()}>
                    {config[0].toUpperCase()}
                    {config.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      {!(!isOpen && type === ConfigType.TEXTAREA) && (
        <Separator
          orientation="horizontal"
          className="w-auto mx-6 bg-slate-500"
        ></Separator>
      )}
      <CardContent className="pb-2">
        <div className="mt-2">
          {isOpen ? (
            <div className="">
              {type === ConfigType.DROPDOWN ||
              type === ConfigType.ARRAY ||
              type === ConfigType.COMBOBOX ? (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center h-10">
                    <div className="font-medium">Description</div>
                    <div className="flex gap-4">
                      <p className="font-medium">Required?</p>
                      <Switch
                        checked={isMandatory}
                        onCheckedChange={handleRequiredChange}
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Adding your description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
                          <DialogTitle>
                            Adding new value for {label}
                          </DialogTitle>
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
                    <ConfigDnD key={id} id={id} values={values}></ConfigDnD>
                  </ScrollArea>
                </div>
              ) : (
                <div>No additional options for this type.</div>
              )}
              {type === ConfigType.TEXTAREA && (
                <div className="mt-2 text-gray-500">
                  <p>
                    Textarea type selected. You can enter multiple lines of
                    text.
                  </p>
                </div>
              )}
            </div>
          ) : (
            !(type === ConfigType.TEXTAREA) && (
              <ScrollArea className="h-[100px] border rounded-md p-2">
                <ConfigDnD key={id} id={id} values={values}></ConfigDnD>
              </ScrollArea>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
