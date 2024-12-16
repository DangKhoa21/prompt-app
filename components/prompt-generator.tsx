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
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";

export function PromptGeneratorSidebar() {
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [context, setContext] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const generatePrompt = () => {
    // This is a simple prompt generation logic. You can make it more sophisticated as needed.
    const prompt = `Generate a ${tone} response, approximately ${length} words long.
Context: ${context}
Include the following keywords: ${keywords}`;
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
        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="tone">Tone/Style</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Select onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="length">Desired Length (words)</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Input
              id="length"
              type="number"
              placeholder="e.g., 100"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="context">Context</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Textarea
              id="context"
              placeholder="Provide context for your prompt"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px]"
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="keywords">Keywords</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Textarea
              id="keywords"
              placeholder="Enter keywords (comma-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="min-h-[80px]"
            />
          </SidebarGroupContent>
        </SidebarGroup>

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
