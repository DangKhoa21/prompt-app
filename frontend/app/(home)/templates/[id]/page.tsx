"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pencil, Settings, X } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Config {
  id: string;
  label: string;
  type: string;
  value: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  systemInstruction: string;
  promptTemplate: string;
  configs: Config[];
}

// This would typically come from an API or database
const templateData: Template = {
  id: "1",
  name: "Template Name",
  description:
    "This template is used for writing, brainstorming new idea for your project, ... etc",
  tags: ["Writing", "Project", "Creative"],
  systemInstruction: "",
  promptTemplate: "",
  configs: [
    { id: "1", label: "Label", type: "Type", value: "Value" },
    { id: "2", label: "Label", type: "Type", value: "Value" },
  ],
};

// TODO: Implement page for specified ID
export default function Page() {
  return (
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
              <h1 className="text-2xl font-semibold">{templateData.name}</h1>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <p className="text-muted-foreground">
                {templateData.description}
              </p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {templateData.tags.map((tag) => (
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    System Instruction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter system instruction..."
                    className="min-h-[200px]"
                    value={templateData.systemInstruction}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Prompt template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter prompt template..."
                    className="min-h-[200px]"
                    value={templateData.promptTemplate}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {templateData.configs.map((config) => (
                <Card key={config.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Config {config.id}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Input placeholder="Label" value={config.label} />
                      <Input placeholder="Type" value={config.type} />
                      <Input placeholder="Value" value={config.value} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="secondary"
              className="bg-red-100 hover:bg-red-200 text-red-600"
            >
              Parse
            </Button>
            <Button
              variant="secondary"
              className="bg-red-100 hover:bg-red-200 text-red-600"
            >
              Reset
            </Button>
            <Button variant="secondary">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
