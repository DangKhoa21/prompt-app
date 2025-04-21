"use client";

import { LoadingSpinner } from "@/components/icons";
import { ArrayConfig } from "@/components/prompt/generator-items/array-config";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
import { PromptSearch } from "@/components/prompt/prompt-search";
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
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { usePrompt } from "@/context/prompt-context";
import { usePinPrompt } from "@/features/template";
import { getPrompt } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  FileQuestion,
  Pin,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PromptGeneratorSidebar() {
  const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {},
  );
  const [arrayValues, setArrayValues] = useState<
    Record<string, { id: string; values: string[] }[]>
  >({});

  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: () => getPrompt(promptId),
  });

  useEffect(() => {
    if (!data) return;

    const newSelected: Record<string, string> = {};
    const newTextarea: Record<string, string> = {};
    const newArray: Record<string, { id: string; values: string[] }[]> = {};

    data.configs.forEach((config) => {
      const paramValue = searchParams.get(config.label);
      if (!paramValue) return;

      if (config.type === "dropdown" || config.type === "combobox") {
        newSelected[config.label] = paramValue;
      } else if (config.type === "textarea") {
        newTextarea[config.label] = paramValue;
      } else if (config.type === "array") {
        try {
          const parsed = JSON.parse(paramValue);
          if (Array.isArray(parsed)) {
            newArray[config.label] = parsed;
          }
        } catch (e) {
          console.log(e);
          console.error("Invalid array param:", paramValue);
        }
      }
    });

    setSelectedValues(newSelected);
    setTextareaValues(newTextarea);
    setArrayValues(newArray);
  }, [data, searchParams]);

  useEffect(() => {
    if (data && data.systemInstruction !== systemInstruction) {
      setSystemInstruction(data.systemInstruction as string | null);
    }
  }, [data, systemInstruction, setSystemInstruction]);

  const pinPromptMutation = usePinPrompt();

  if (isPending) {
    return (
      <div className="flex h-full justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 justify-center text-center items-center mt-4">
        <p className="text-sm">Please try again! {error.message}</p>
        <Button variant="ghost" className="h-8" onClick={() => refetch()}>
          <RotateCcw />
          Retry
        </Button>
      </div>
    );
  }

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

  const handlePrompt = (isSending: boolean) => {
    const template = data.stringTemplate;
    let prompt = template;

    data.configs.forEach((config) => {
      prompt = prompt.replace("$", "");
      if (config.type === "dropdown" || config.type === "combobox") {
        if (
          selectedValues[config.label] &&
          selectedValues[config.label] !== "None"
        ) {
          prompt = prompt.replace(
            `{${config.label}}`,
            selectedValues[config.label],
          );
        } else {
          prompt = prompt.replace(`{${config.label}}`, "");
        }
      } else if (config.type === "textarea") {
        if (textareaValues[config.label]) {
          prompt = prompt.replace(
            `{${config.label}}`,
            textareaValues[config.label],
          );
        } else {
          prompt = prompt.replace(`{${config.label}}`, "");
        }
      } else if (config.type === "array") {
        const replaceValue = arrayValues[config.label]
          ? arrayValues[config.label]
              .map((item, index) =>
                item.values
                  .map(
                    (value, labelIndex) =>
                      `\n\t${config.values[labelIndex].value} ${
                        index + 1
                      }: ${value}`,
                  )
                  .join(""),
              )
              .join("\n")
          : "";

        prompt = prompt.replace(`{${config.label}}`, `${replaceValue}`);
      }
    });

    // Remove only excessive spaces, not newlines "\n"
    prompt = prompt.replace(/ {2,}/g, " ");
    prompt = prompt.replace(/\\n/g, "\n");
    setPrompt({
      value: prompt,
      isSending,
    });
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    params.set("promptId", promptId || "");

    data.configs.forEach((config) => {
      const key = config.label;

      if (config.type === "dropdown" || config.type === "combobox") {
        if (selectedValues[key]) {
          params.set(key, selectedValues[key]);
        }
      } else if (config.type === "textarea") {
        if (textareaValues[key]) {
          params.set(key, textareaValues[key]);
        }
      } else if (config.type === "array") {
        const arrayData = arrayValues[key];
        if (arrayData) {
          params.set(key, JSON.stringify(arrayData));
        }
      }
    });

    url.search = params.toString();
    navigator.clipboard.writeText(url.toString());
    toast.success("Shareable URL copied to clipboard!");
  };

  return (
    <>
      <SidebarHeader className="pb-0">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => window.history.back()}
            >
              <ChevronLeft />
            </Button>
            <div className="text-base leading-tight ml-2">
              <span className="font-semibold">{data.title}</span>
            </div>
          </div>
          {data.id !== "1" && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleShare()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => pinPromptMutation.mutate(data.id)}
              >
                <Pin />
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent className="px-4">
            <p>{data.description}</p>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="prompt-search">Search for another prompt</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <PromptSearch />
          </SidebarGroupContent>
        </SidebarGroup>

        {data.configs?.map((config) => (
          <SidebarGroup key={config.label}>
            <SidebarGroupLabel className="flex justify-between">
              <Label htmlFor={config.label.toLowerCase()}>{config.label}</Label>
              <Button variant="ghost" className="h-8 w-8 mr-2">
                <FileQuestion></FileQuestion>
              </Button>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
              {config.type === "combobox" ? (
                <CreatableCombobox
                  options={config.values}
                  value={selectedValues[config.label]}
                  onChange={(value) => handleSelectChange(config.label, value)}
                  placeholder={`Select a ${config.label.toLowerCase()}`}
                  onCreateOption={(inputValue) =>
                    handleCreateOption(config.label, inputValue)
                  }
                />
              ) : config.type === "dropdown" ? (
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(config.label, value)
                  }
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
              ) : config.type === "textarea" ? (
                <Textarea
                  id={config.label}
                  placeholder={`Input your content`}
                  value={textareaValues[config.label]}
                  onChange={(e) =>
                    handleTextareaChange(config.label, e.target.value)
                  }
                  // className={config.className}
                />
              ) : config.type === "array" ? (
                <>
                  <ArrayConfig
                    id={config.label}
                    labels={config.values.map((value) => {
                      return value.value;
                    })}
                    values={arrayValues[config.label]}
                    setArrayValues={setArrayValues}
                  ></ArrayConfig>
                </>
              ) : null}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {data.id !== "1" && (
        <SidebarFooter>
          <div className="flex justify-around gap-4 p-2">
            <Button className="w-1/2" onClick={() => handlePrompt(false)}>
              Generate
            </Button>
            <Button className="w-1/2" onClick={() => handlePrompt(true)}>
              Send
            </Button>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}
