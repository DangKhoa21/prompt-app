"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptTemplateCard } from "@/components/prompt-template-card";
import { Search, ChevronDown } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getPrompts } from "@/services/prompt";

const templates = Array(9).fill({
  title: "Translate",
  description: "Translate the provided text into your desired language",
  rating: "4.5k",
  author: "someone",
});

const filters = Array(6).fill("Summarize").concat(["More"]);

export default function Page() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => getPrompts(),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  console.log("Check data: ", data);

  return (
    <main className="flex-1 overflow-auto bg-background-primary">
      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-6">
            Discover and create custom versions prompts that combine
            instructions, extra knowledge, and any combination of skills.
          </p>

          <div className="inline-flex relative mb-6 w-3/5 max-w-screen-lg justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {filters.map((filter, i) => (
            <Button
              key={i}
              variant={i === filters.length - 1 ? "default" : "secondary"}
              size="sm"
              className="rounded-2xl gap-1 px-4"
            >
              {filter}
              {i === filters.length - 1 && (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          ))}
        </div>

        <div className="px-0 py-8 md:px-4 bg-background-tertiary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_320px)]">
          {templates.map((template, i) => (
            <PromptTemplateCard key={i} {...template} />
          ))}
        </div>
        {data.map((item, i) => (
          <p key={item.id}>{item.id}, {item.title}, {item.description}, {item.stringTemplate}</p>
        ))}
      </div>
    </main>
  );
}
