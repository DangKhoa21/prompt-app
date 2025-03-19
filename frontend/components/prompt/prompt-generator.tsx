"use client";

import { LoadingSpinner } from "@/components/icons";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
import { PromptSearch } from "@/components/prompt/prompt-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ArrayConfig } from "@/features/prompt-generator";
import { getPrompt } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileQuestion, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function PromptGeneratorSidebar() {
  const { setPrompt } = usePrompt();
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
      if (config.type === "dropdown") {
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
    setPrompt({ value: prompt, isSending });
  };

  return (
    <>
      <SidebarHeader className="pb-0">
        <div className="flex items-center p-2">
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
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent className="px-4">
            <p>{data.description}</p>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Label>Search for another prompt</Label>
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
              {config.type === "dropdown" ? (
                <CreatableCombobox
                  options={config.values}
                  value={selectedValues[config.label]}
                  onChange={(value) => handleSelectChange(config.label, value)}
                  placeholder={`Select a ${config.label.toLowerCase()}`}
                  onCreateOption={(inputValue) =>
                    handleCreateOption(config.label, inputValue)
                  }
                />
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
