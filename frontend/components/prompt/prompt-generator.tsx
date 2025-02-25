"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getPrompt } from "@/services/prompt";
import { useSearchParams } from "next/navigation";
import { usePrompt } from "@/context/prompt-context";
import { PromptSearch } from "./prompt-search";

export function PromptGeneratorSidebar() {
  const { setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {},
  );

  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: () => getPrompt(promptId),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleSelectChange = (configLabel: string, value: string) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const handleTextareChange = (configLabel: string, value: string) => {
    setTextareaValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const generatePrompt = () => {
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
      }
    });

    prompt = prompt.replace(/\s{2,}/g, " ");
    prompt = prompt.replace(/\\n/g, "\n");
    setPrompt(prompt);
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
            <SidebarGroupLabel>
              <Label htmlFor={config.label.toLowerCase()}>{config.label}</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
              {config.type === "dropdown" ? (
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(config.label, value)
                  }
                >
                  <SelectTrigger id={config.label}>
                    <SelectValue
                      placeholder={`Select a ${config.label.toLowerCase()}`}
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
                    handleTextareChange(config.label, e.target.value)
                  }
                  // className={config.className}
                />
              ) : null}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {data.id !== "1" && (
        <SidebarFooter>
          <div className="flex justify-around gap-4 p-2">
            <Button className="w-1/2" onClick={() => generatePrompt()}>
              Generate
            </Button>
            <Button className="w-1/2">Send</Button>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}
