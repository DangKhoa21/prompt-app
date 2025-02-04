import { Template } from "@/app/(home)/templates/[id]/page";
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
  DropdownMenuItem,
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
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { ConfigType } from "@/services/templates/enum";
import { Settings, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { v7 } from "uuid";

interface ConfigValue {
  id: string;
  value: string;
}

interface ConfigProp {
  id: string;
  label: string;
  type: ConfigType;
  configValues: ConfigValue[] | null;
  setPromptData: Dispatch<SetStateAction<Template>>;
}

export default function TemplatesConfigData({
  id,
  label,
  type,
  configValues,
  setPromptData,
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
                ...(config.configValues ?? []),
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
              configValues: (config.configValues ?? []).filter(
                (value) => value.id !== configValueId,
              ),
            }
          : config,
      ),
    }));
  };

  return (
    <Card key={id} className="bg-background-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Config {id}</CardTitle>
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
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <SidebarGroup key={label}>
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Label</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2 my-auto">
              <p>{label}</p>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup key={label}>
            <SidebarGroupLabel>
              <Label htmlFor={label.toLowerCase()}>Config Type</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
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
            </SidebarGroupContent>
          </SidebarGroup>

          {type === ConfigType.Dropdown ? (
            <SidebarGroup key={label}>
              <SidebarGroupLabel>
                <Label htmlFor={label.toLowerCase()}>List of values</Label>
              </SidebarGroupLabel>

              <SidebarGroupContent className="px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Show</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      &apos;{label}&apos; list values
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {configValues === null || configValues.length === 0 ? (
                      <div className="mx-auto flex items-center justify-center">
                        Currently empty
                      </div>
                    ) : (
                      configValues.map((configValue) => (
                        <div
                          key={configValue.id}
                          className="flex justify-between px-2 py-1"
                        >
                          {configValue.value}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              handleDeleteConfigValue(id, configValue.id)
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
                          <Button variant="outline">Add new item</Button>
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
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <></>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
