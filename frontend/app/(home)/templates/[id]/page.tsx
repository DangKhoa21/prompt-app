"use client";

import TemplatesConfigData from "@/components/templates/templates-config-data";
import TemplatesConfigTextarea from "@/components/templates/templates-config-textarea";
import EditTextField from "@/components/templates/templates-edit-text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ConfigType } from "@/lib/templates/enum";
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

// TODO: Implement page for specified ID (Missing tags, save to cloud)
export default function Page() {
  const [initialPrompt, setInitialPrompt] = useState<Template>({
    id: "1",
    name: "Template Name",
    description:
      "This template is used for writing, brainstorming new idea for your project, ... etc",
    tags: ["Writing", "Project", "Creative"],
    systemInstruction:
      "You are asked to perform the following action with specified role, follow them strictly.",
    promptTemplate:
      "You are my ${Role}, and your task is to help me in ${Field} at the level of ${Level}. More detail: ${Detail}",
    configs: [
      {
        id: "1",
        label: "Role",
        type: ConfigType.Dropdown,
        configValues: [
          { id: "1", value: "Teacher" },
          { id: "2", value: "Assistant" },
        ],
      },
      {
        id: "2",
        label: "Field",
        type: ConfigType.Dropdown,
        configValues: [
          { id: "1", value: "Computer Science" },
          { id: "2", value: "Information Technology" },
        ],
      },
      {
        id: "3",
        label: "Level",
        type: ConfigType.Dropdown,
        configValues: [
          { id: "1", value: "Beginner" },
          { id: "2", value: "Intermediate" },
          { id: "3", value: "Expert" },
        ],
      },
      {
        id: "4",
        label: "Detail",
        type: ConfigType.Textarea,
        configValues: null,
      },
    ],
  });

  const [promptData, setPromptData] = useState<Template>(initialPrompt);

  const { open } = useSidebar();

  const handleParseTemplate = () => {
    const promptTemplate = promptData.promptTemplate;
    const matches = Array.from(
      new Set(
        promptTemplate.match(/\$\{([^}]+)\}/g)?.map((m) => m.slice(2, -1)) ||
          [],
      ),
    );

    const createConfig = (
      id: string,
      label: string,
      type: ConfigType,
      configValues: ConfigValue[] | null,
    ): Config => ({
      id: id.toString(),
      label,
      type,
      configValues,
    });

    const result =
      matches.length !== 0
        ? matches.map((name, index) => {
            const res = promptData.configs.find((c) => c.label === name);
            return (
              res ??
              createConfig(
                (index + 1).toString(),
                name,
                ConfigType.Textarea,
                null,
              )
            );
          })
        : [];

    setPromptData((prevState) => ({
      ...prevState,
      configs: result,
    }));
  };

  const handleReset = () => {
    setPromptData(initialPrompt);
  };

  //TODO: Hanle save to api
  const handleSave = () => {
    setInitialPrompt(promptData);
  };

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
                <EditTextField
                  text={promptData.name}
                  label="name"
                  setPromptData={setPromptData}
                  className="text-2xl font-semibold"
                ></EditTextField>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <EditTextField
                  text={promptData.description}
                  label="description"
                  setPromptData={setPromptData}
                  className="text-muted-foreground text-lg"
                ></EditTextField>
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

            <div
              className={cn(
                "grid gap-6 h-fit",
                open ? "md:grid-cols-1" : "md:grid-cols-2",
              )}
            >
              <div className="space-y-4 h-fit">
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

              <div className="h-full">
                <div className="text-xl font-semibold p-2">List of Configs</div>

                <ScrollArea className="h-[576px] border rounded-md p-4 lg:ml-12">
                  <div className="space-y-4">
                    {promptData.configs.map((config) => (
                      <TemplatesConfigData
                        key={config.id}
                        {...config}
                        setPromptData={setPromptData}
                        isSidebarOpen={open}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="grid items-center justify-end md:grid-cols-2">
              <div className="flex justify-end">
                {/* Parse button */}
                <Button
                  variant="ghost"
                  className="h-8 mr-3 border border-slate-500"
                  onClick={handleParseTemplate}
                >
                  Parse
                </Button>
              </div>
              <div className="flex gap-6 justify-end">
                {/* Reset button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 border border-slate-500"
                    >
                      Reset
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your changes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Saving button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="default"
                      className="h-8 border border-primary hover:bg-primary"
                    >
                      Save
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you done editing?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirm completed your changes and save it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
