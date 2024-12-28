"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function capitalize(str: string): string {
  if (!str) return ""; // Handle empty or undefined strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function PromptGeneratorSidebar() {
  const CreateState = () => {
    const [state, setState] = useState("");
    return { state, setState };
  };

  const inputFields = [
    {
      label: "tone",
      labelName: "Tone/Style",
      labelPlaceholder: "Select tone",
      type: "select",
      state: CreateState(),
      values: ["professional", "casual", "formal", "friendly"],
      className: "",
    },
    {
      label: "length",
      labelName: "Desired Length (words)",
      labelPlaceholder: "e.g., 100",
      type: "input",
      inputType: "number",
      state: CreateState(),
      values: {},
      className: "",
    },
    {
      label: "context",
      labelName: "Context",
      labelPlaceholder: "Provide context for your prompt",
      type: "textarea",
      state: CreateState(),
      values: {},
      className: "min-h-[100px]",
    },
    {
      label: "keywords",
      labelName: "Keywords",
      labelPlaceholder: "Enter keywords (comma-separated)",
      type: "textarea",
      state: CreateState(),
      values: {},
      className: "min-h-[80px]",
    },
  ];

  // const [tone, setTone] = useState("")
  // const [length, setLength] = useState("")
  // const [context, setContext] = useState("")
  // const [keywords, setKeywords] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const generatePrompt = () => {
    // Template prompt
    //         const prompt = `Generate a ${tone} response, approximately ${length} words long.
    // Context: ${context}
    // Include the following keywords: ${keywords}`

    const findState = (field: string) => {
      const output =
        inputFields.find((item) => item.label === field)?.state.state || "";
      return output;
    };

    const prompt = `Generate a ${findState(
      "tone"
    )} response, approximately ${findState("length")} words long.
Context: ${findState("context")}
Include the following keywords: ${findState("keywords")}`;

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
            <span className="truncate font-semibold">Write For Me</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {inputFields.map((item) => (
          <SidebarGroup key={item.label}>
            <SidebarGroupLabel>
              <Label htmlFor={item.label}>{item.labelName}</Label>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
              {Array.isArray(item.values) ? (
                <Select onValueChange={item.state.setState}>
                  <SelectTrigger id={item.label}>
                    <SelectValue placeholder={item.labelPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {item.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {capitalize(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : item.type === "input" ? (
                <Input
                  id={item.label}
                  type={item.inputType}
                  placeholder={item.labelPlaceholder}
                  value={item.state.state}
                  onChange={(e) => item.state.setState(e.target.value)}
                  className={item.className}
                />
              ) : (
                <Textarea
                  id={item.label}
                  placeholder={item.labelPlaceholder}
                  value={item.state.state}
                  onChange={(e) => item.state.setState(e.target.value)}
                  className={item.className}
                />
              )}
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
          <Button className="w-1/2" onClick={generatePrompt}>
            Generate
          </Button>
          <Button className="w-1/2">Send</Button>
        </div>
      </SidebarFooter>
    </>
  );
}
