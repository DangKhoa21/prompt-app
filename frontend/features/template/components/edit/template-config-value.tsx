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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { ConfigType } from "@/features/template";
import { cn } from "@/lib/utils";
import {
  TemplateConfig,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { List, Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { v7 } from "uuid";

interface ConfigVariableProps extends TemplateConfig {
  index: number;
  setPromptData: Dispatch<SetStateAction<TemplateWithConfigs>>;
  isSidebarOpen?: boolean;
}

export function TemplatesConfigVariable({
  id,
  index,
  label,
  type,
  field = [],
  values,
  setPromptData,
  isSidebarOpen,
}: ConfigVariableProps) {
  const [newConfigValue, setNewConfigValue] = useState("");
  const [latestAdded, setLatestAdded] = useState("");
  const [addingError, setAddingError] = useState("");

  const handleSelectChange = (configId: string, type: ConfigType) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              type: ConfigType[type.toUpperCase() as keyof typeof ConfigType],
            }
          : config,
      ),
    }));
  };

  const handleAddConfigValue = (event: React.FormEvent, configId: string) => {
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
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
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
    }));

    setLatestAdded(value);
    setNewConfigValue("");
  };

  const handleDeleteConfigValue = (configId: string, configValueId: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              values: (config.values ?? []).filter(
                (value) => value.id !== configValueId,
              ),
            }
          : config,
      ),
    }));
  };

  const handleAddArrayConfigValue = (
    event: React.FormEvent,
    configId: string,
  ) => {
    event.preventDefault();

    const value = newConfigValue;

    if (!value) {
      setAddingError("Value should not be empty");
      return;
    }

    if (field.some((name) => name === value)) {
      setAddingError(`Already have field name: "${value}"`);
      return;
    }
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              field: [...(config.field ?? []), value],
            }
          : config,
      ),
    }));

    setLatestAdded(value);
    setNewConfigValue("");
  };

  const handleDeleteArrayConfigValue = (
    configId: string,
    fieldName: string,
  ) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              field: (config.field ?? []).filter((name) => name !== fieldName),
            }
          : config,
      ),
    }));
  };

  // TODO: Smaller display on small devices (slide left to delete item instead of click)
  return (
    <Card key={id} className="border border-slate-500">
      <CardHeader
        className={cn("pt-6 pb-2 px-4", isSidebarOpen ? "md:px-6" : "lg:px-4")}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Config {index + 1}
          </CardTitle>
        </div>
      </CardHeader>
      <Separator
        orientation="horizontal"
        className="w-auto mx-6 bg-slate-500"
      ></Separator>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-0">
          <SidebarGroup key={`Name-${id}`}>
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Label</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2 my-auto">
              <p>{label}</p>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup key={`Type-${id}`} className="col-span-2">
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Config Type</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2 flex flex-row gap-2 items-center">
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

              {/* Icon show list if type is dropdown */}
              {type === ConfigType.DROPDOWN ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <List className="w-8 h-8" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="flex flex-row items-center justify-between">
                      <div>&apos;{label}&apos; list values</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-4 h-4 mr-1"
                            >
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
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {values.length === 0 ? (
                      <div className="mx-auto flex items-center justify-center">
                        Currently empty
                      </div>
                    ) : (
                      values.map((value) => (
                        <div
                          key={value.id}
                          className="group flex justify-between h-10 text-sm items-center px-2 py-1 hover:bg-accent"
                        >
                          {typeof value.value === "string" ? value.value : ""}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 -translate-x-2 transition ease-in-out delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-2"
                            onClick={() =>
                              handleDeleteConfigValue(id, value.id)
                            }
                          >
                            <X />
                          </Button>
                        </div>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : type === ConfigType.ARRAY ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <List className="w-8 h-8" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="flex flex-row items-center justify-between">
                        <div>&apos;{label}&apos; list values</div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-4 h-4 mr-1"
                              >
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
                                <Label
                                  htmlFor="newValue"
                                  className="text-right"
                                >
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
                                onClick={(e) =>
                                  handleAddArrayConfigValue(e, id)
                                }
                              >
                                Add
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {field.length === 0 ? (
                        <div className="mx-auto flex items-center justify-center">
                          Currently empty
                        </div>
                      ) : (
                        field.map((name, i) => (
                          <div
                            key={i}
                            className="group flex justify-between h-10 text-sm items-center px-2 py-1 hover:bg-accent"
                          >
                            {name}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 -translate-x-2 transition ease-in-out delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-2"
                              onClick={() =>
                                handleDeleteArrayConfigValue(id, name)
                              }
                            >
                              <X />
                            </Button>
                          </div>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <></>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </CardContent>
    </Card>
  );
}
