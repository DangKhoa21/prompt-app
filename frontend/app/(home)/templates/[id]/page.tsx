"use client";

import TemplatesConfigData from "@/components/templates/templates-config-data";
import TemplatesConfigTextarea from "@/components/templates/templates-config-textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfigType } from "@/services/templates/enum";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ConfigValue {
  id: string;
  value: string;
}

interface Config {
  id: string;
  label: string;
  type: ConfigType;
  configValues: ConfigValue[] | null;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  systemInstruction: string;
  promptTemplate: string;
  configs: Config[];
}

// TODO: Implement page for specified ID
export default function Page() {
  const [promptData, setPromptData] = useState<Template>({
    id: "1",
    name: "Template Name",
    description:
      "This template is used for writing, brainstorming new idea for your project, ... etc",
    tags: ["Writing", "Project", "Creative"],
    systemInstruction: "",
    promptTemplate: "",
    configs: [
      {
        id: "1",
        label: "Testing",
        type: ConfigType.Dropdown,
        configValues: [
          { id: "1", value: "haha" },
          { id: "2", value: "hihi" },
        ],
      },
      {
        id: "2",
        label: "Checking",
        type: ConfigType.Dropdown,
        configValues: [
          { id: "1", value: "huhu" },
          { id: "2", value: "hehe" },
        ],
      },
      {
        id: "3",
        label: "Testing",
        type: ConfigType.Textarea,
        configValues: null,
      },
    ],
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/templates">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-sm font-medium">Templates</h1>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold">{promptData.name}</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <p className="text-muted-foreground">
                  {promptData.description}
                </p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {promptData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <TemplatesConfigTextarea
                  id="systemInstruction"
                  label="System Instruction"
                  placeholder="Enter your System Instruction ..."
                  value={promptData.systemInstruction}
                  setPromptData={setPromptData}
                />

                <TemplatesConfigTextarea
                  id="promptTemplate"
                  label="Prompt Template"
                  placeholder="Enter your Prompt Template..."
                  value={promptData.promptTemplate}
                  setPromptData={setPromptData}
                />
              </div>

              <div className="space-y-4">
                {promptData.configs.map((config) => (
                  <TemplatesConfigData
                    key={config.id}
                    {...config}
                    setPromptData={setPromptData}
                  />
                ))}
              </div>
            </div>

            <div className="grid items-center justify-end md:grid-cols-2">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="h-8 mr-3 border border-slate-500"
                >
                  Parse
                </Button>
              </div>
              <div className="flex gap-6 justify-end">
                <Button variant="ghost" className="h-8 border border-slate-500">
                  Reset
                </Button>
                <Button
                  variant="default"
                  className="h-8 border border-primary hover:bg-primary"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
