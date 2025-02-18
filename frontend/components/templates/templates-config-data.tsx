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
import { cn } from "@/lib/utils";
import { ConfigType } from "@/lib/templates/enum";
import { List, Plus, Settings, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { v7 } from "uuid";
import {
  TemplateConfig,
  TemplateWithConfigs,
} from "@/services/prompt/interface";

interface ConfigProp extends TemplateConfig {
  index: string;
  setPromptData: Dispatch<SetStateAction<TemplateWithConfigs>>;
  isSidebarOpen?: boolean;
}

export default function TemplatesConfigData({
  id,
  index,
  label,
  type,
  values,
  setPromptData,
  isSidebarOpen,
}: ConfigProp) {
  const [newConfigValue, setNewConfigValue] = useState("Happy");

  const handleSelectChange = (configId: string, type: ConfigType) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId ? { ...config, type: ConfigType[type] } : config,
      ),
    }));
  };

  const handleAddConfigValue = (event: React.FormEvent, configId: string) => {
    event.preventDefault();

    const value = newConfigValue;
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              configValues: [
                ...(config.values ?? []),
                { id: v7(), value: value },
              ],
            }
          : config,
      ),
    }));

    setNewConfigValue("Happy");
  };

  const handleDeleteConfig = (configId: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.filter((config) => config.id !== configId),
    }));
  };

  const handleDeleteConfigValue = (configId: string, configValueId: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      configs: prevState.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              configValues: (config.values ?? []).filter(
                (value) => value.id !== configValueId,
              ),
            }
          : config,
      ),
    }));
  };

  // TODO: Smaller display on small devices (slide left to delete item instead of click)
  return (
    <Card key={id} className="bg-background-primary border border-slate-500">
      <CardHeader
        className={cn("pt-4 pb-2 px-4", isSidebarOpen ? "md:px-6" : "lg:px-4")}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Config {index + 1}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDeleteConfig(id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator
        orientation="horizontal"
        className="w-auto mx-6 bg-slate-500"
      ></Separator>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-0">
          <SidebarGroup key={`Name-${id}`}>
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Label</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2 my-auto">
              <p>{label}</p>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup key={`Type-${id}`}>
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Config Type</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2 flex flex-row gap-2 items-center">
              <Select
                onValueChange={(value) => {
                  const handledValue =
                    ConfigType[value as keyof typeof ConfigType];
                  handleSelectChange(id, handledValue);
                }}
              >
                <SelectTrigger id={type.toString()}>
                  <SelectValue placeholder={`${type}`} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ConfigType)
                    .filter((value) => isNaN(Number(value)))
                    .map((config) => (
                      <SelectItem key={config} value={config.toString()}>
                        {config}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Icon show list if type is dropdown */}
              {type === ConfigType.Dropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <List className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      &apos;{label}&apos; list values
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {values === null || values.length === 0 ? (
                      <div className="mx-auto flex items-center justify-center">
                        Currently empty
                      </div>
                    ) : (
                      values.map((value) => (
                        <div
                          key={value.id}
                          className="group flex justify-between h-8 text-sm items-center px-2 py-1"
                        >
                          {value.value}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hidden group-hover:flex group-focus:flex h-8 w-8 text-destructive"
                            onClick={() =>
                              handleDeleteConfigValue(id, value.id)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 mx-2"
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
                              onChange={(e) =>
                                setNewConfigValue(e.target.value)
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
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
                  </DropdownMenuContent>
                </DropdownMenu>
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
