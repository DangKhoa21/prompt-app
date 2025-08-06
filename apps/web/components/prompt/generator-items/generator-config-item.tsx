import { ArrayConfig } from "@/components/prompt/generator-items/array-config";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar";
import { Textarea } from "@workspace/ui/components/textarea";
import { BetterTooltip } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { parseInfo } from "@/lib/utils/utils.details";
import { PromptConfig, TemplateConfig } from "@/services/prompt/interface";
import { CircleHelp } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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
    if (!value) return;

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
        <Button
          variant="ghost"
          className="h-8 w-8 mr-2"
          aria-label="View description"
        >
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
            value={selectedValues[config.label] ?? ""}
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
            values={arrayValues[config.label] ?? []}
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
