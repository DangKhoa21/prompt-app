import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { BetterTooltip } from "@/components/ui/tooltip";
import { cn, parseInfo } from "@/lib/utils";
import { PromptConfig, TemplateConfig } from "@/services/prompt/interface";
import { CircleHelp } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ArrayConfig } from "./array-config";
import { CreatableCombobox } from "./creatable-combobox";

interface RenderConfigInputProps {
  config: PromptConfig | TemplateConfig;
  isFilled: {
    isValid: boolean;
    unfilledConfigs: string[];
    filledCount: number;
    totalCount: number;
  };
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
  setSelectedValues: Dispatch<SetStateAction<Record<string, string>>>;
  setTextareaValues: Dispatch<SetStateAction<Record<string, string>>>;
  setArrayValues: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          id: string;
          values: string[];
        }[]
      >
    >
  >;
}

export default function RenderConfigInput({
  config,
  isFilled,
  selectedValues,
  textareaValues,
  arrayValues,
  setSelectedValues,
  setTextareaValues,
  setArrayValues,
}: RenderConfigInputProps) {
  const extractedInfo = parseInfo(config.info);

  const handleSelectChange = (configLabel: string, value: string) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const handleCreateOption = (configLabel: string, inputValue: string) => {
    const newOption = {
      value: inputValue,
    };

    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: newOption.value,
    }));
  };

  const handleTextareaChange = (configLabel: string, value: string) => {
    setTextareaValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const isUnfilled = isFilled.unfilledConfigs.includes(config.label);
  const label = (
    <SidebarGroupLabel className="flex justify-between">
      <div className="flex gap-2">
        <Label>{config.label}</Label>
        {isUnfilled && (
          <p className={cn("text-xs", isUnfilled ? "text-red-400" : "")}>
            Required
          </p>
        )}
      </div>
      <BetterTooltip
        content={
          extractedInfo.description
            ? `${extractedInfo.description}`
            : "Description is not available"
        }
      >
        <Button variant="ghost" className="h-8 w-8 mr-2">
          <CircleHelp />
        </Button>
      </BetterTooltip>
    </SidebarGroupLabel>
  );

  const content = (() => {
    switch (config.type) {
      case "dropdown":
        return (
          <Select
            onValueChange={(value) => handleSelectChange(config.label, value)}
          >
            <SelectTrigger id={config.label}>
              <SelectValue
                placeholder={
                  selectedValues[config.label] ??
                  `Select a ${config.label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              {config.values.map((value) => (
                <SelectItem key={value.id} value={value.value}>
                  {value.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "combobox":
        return (
          <CreatableCombobox
            options={config.values}
            value={selectedValues[config.label]}
            onChange={(value) => handleSelectChange(config.label, value)}
            placeholder={`Select a ${config.label.toLowerCase()}`}
            onCreateOption={(inputValue) =>
              handleCreateOption(config.label, inputValue)
            }
          />
        );

      case "textarea":
        return (
          <Textarea
            id={config.label}
            placeholder="Input your content"
            value={textareaValues[config.label]}
            onChange={(e) => handleTextareaChange(config.label, e.target.value)}
          />
        );

      case "array":
        return (
          <ArrayConfig
            id={config.label}
            labels={config.values.map((v) => v.value)}
            values={arrayValues[config.label]}
            setArrayValues={setArrayValues}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <SidebarGroup key={config.label}>
      {label}
      <SidebarGroupContent className="px-2">{content}</SidebarGroupContent>
    </SidebarGroup>
  );
}
