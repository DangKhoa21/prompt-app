import PromptTemplateCard from "@/components/prompt/prompt-templates-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: "1",
    name: "Template Name",
    description:
      "This template is used for writing, brainstorming new idea for your project, ... etc",
    tags: ["Writing", "Project", "Creative"],
  },
  {
    id: "2",
    name: "Template 2 Name",
    description:
      "This template is used for writing, brainstorming new idea for your project, ... etc",
    tags: ["Writing", "Project", "Creative"],
  },
];

// TODO: Implement UI for templates page
export default function Page() {
  return (
    <>
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/marketplace">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-sm font-medium">Templates</h1>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-9" />
              </div>
              <Button variant="outline" className="shrink-0">
                Filters
              </Button>
            </div>

            <div className="bg-background-primary rounded-lg p-6 m-6">
              <div className="flex items-center justify-between mb-4 mx-4">
                <h2 className="text-lg font-bold">Your templates</h2>
                <Button size="sm">Add new</Button>
              </div>

              <Separator
                orientation="horizontal"
                className="w-auto mx-4 my-1 bg-neutral-800"
              />

              <div className="space-y-4 p-4">
                {templates.map((template, index) => (
                  <PromptTemplateCard key={index} {...template} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
