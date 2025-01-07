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

export function PromptGeneratorSidebar() {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );

  const promptId = "0194382b-5606-7923-9f3f-1c9deaafc93b";

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
            selectedValues[config.label]
          );
        } else {
          prompt = prompt.replace(`{${config.label}}`, "");
        }
      }
    });

    prompt = prompt.replace(/\s{2,}/g, " ");
    setGeneratedPrompt(prompt);
  };

  return (
    <>
      <SidebarHeader className="pb-0">
        <div className="flex items-center p-2">
          <Button variant="ghost" className="h-8 w-8">
            <ChevronLeft />
          </Button>
          <div className="text-base leading-tight ml-2">
            <span className="truncate font-semibold">{data.title}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent className="px-4">
            <p>{data.description}</p>
          </SidebarGroupContent>
        </SidebarGroup>

        {data.configs.map((config) => (
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
              ) : null}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {generatedPrompt && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <Label htmlFor="generated-prompt">Generated Prompt</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <Textarea
                id="generated-prompt"
                value={generatedPrompt}
                readOnly
                className="h-32"
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-around gap-4 p-2">
          <Button className="w-1/2" onClick={() => generatePrompt()}>
            Generate
          </Button>
          <Button className="w-1/2">Send</Button>
        </div>
      </SidebarFooter>
    </>
  );
}
