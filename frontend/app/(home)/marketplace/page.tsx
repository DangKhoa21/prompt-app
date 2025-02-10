"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptMarketplaceCard } from "@/components/prompt/prompt-marketplace-card";
import { Search, ChevronDown } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getPrompts, getTags } from "@/services/prompt";

// TODO: Fetching data for templates
// const templates = [
//   {
//     id: getRandomOption(),
//     title: "Translate",
//     description: "Translate the provided text into your desired language",
//     rating: "4.5k",
//     author: "AI Team",
//     category: "Language",
//   },
//   {
//     id: getRandomOption(),
//     title: "Summarize",
//     description: "Generate concise summaries of long articles",
//     rating: "5.2k",
//     author: "Content Team",
//     category: "Content",
//   },
//   {
//     id: getRandomOption(),
//     title: "Code Review",
//     description: "Get detailed code reviews with suggestions for improvements",
//     rating: "3.8k",
//     author: "Dev Team",
//     category: "Development",
//   },
//   {
//     id: getRandomOption(),
//     title: "Brainstorm",
//     description: "Give creative suggestions that fit your criterias",
//     rating: "1.2k",
//     author: "Content Team",
//     category: "Content",
//   },
//   {
//     id: getRandomOption(),
//     title: "Teacher",
//     description:
//       "Role-playing option that help AI Agent act as your tutor, explaining concepts that you need",
//     rating: "2.7k",
//     author: "AI Team",
//     category: "Learning",
//   },
//   {
//     id: getRandomOption(),
//     title: "Analyzing Data",
//     description:
//       "Give the data and criterias that fit your demands and AI will give you the expected output",
//     rating: "4.4k",
//     author: "Analyst Team",
//     category: "Analyzing",
//   },
//   {
//     id: getRandomOption(),
//     title: "Write a Blog",
//     description:
//       "Generate a fully detailed blog post on the topic of your choice",
//     rating: "3.9k",
//     author: "Content Team",
//     category: "Writing",
//   },
//   {
//     id: getRandomOption(),
//     title: "Grammar Check",
//     description: "Identify and correct grammatical errors in your writing",
//     rating: "4.7k",
//     author: "Linguist Team",
//     category: "Language",
//   },
//   {
//     id: getRandomOption(),
//     title: "Data Visualization",
//     description: "Create insightful charts and graphs based on your data",
//     rating: "5.0k",
//     author: "Data Team",
//     category: "Analyzing",
//   },
//   {
//     id: getRandomOption(),
//     title: "Generate Ideas",
//     description: "Provide prompts to help brainstorm new and creative ideas",
//     rating: "3.6k",
//     author: "Creative Team",
//     category: "Creativity",
//   },
//   {
//     id: getRandomOption(),
//     title: "Optimize SEO",
//     description:
//       "Analyze and improve the SEO ranking of your website or content",
//     rating: "4.1k",
//     author: "SEO Team",
//     category: "Marketing",
//   },
//   {
//     id: getRandomOption(),
//     title: "Debug Code",
//     description: "Find and fix bugs in your code quickly and effectively",
//     rating: "3.5k",
//     author: "Dev Team",
//     category: "Development",
//   },
// ];

export default function Page() {
  const {
    isPending: isPromptsLoading,
    isError: isPromptsError,
    data: promptsData,
    error: promptsError,
  } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => getPrompts(),
  });

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  if (isPromptsLoading) {
    return <span>Loading...</span>;
  }

  if (isPromptsError) {
    return <span>Error: {promptsError.message}</span>;
  }
  const templates = promptsData;

  if (isTagsLoading) {
    return <span>Loading...</span>;
  }

  if (isTagsError) {
    return <span>Error: {tagsError.message}</span>;
  }
  const tags = tagsData;

  return (
    <main className="flex-1 overflow-auto bg-background">
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
          {tags.map((filter, i) => (
            <Button
              key={i}
              variant={i === tags.length - 1 ? "default" : "secondary"}
              size="sm"
              className="rounded-2xl gap-1 px-4"
            >
              {filter.name}
              {i === tags.length - 1 && (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          ))}
        </div>

        <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_320px)]">
          {templates.map((template, i) => (
            <PromptMarketplaceCard category={""} key={i} {...template} />
          ))}
        </div>
      </div>
    </main>
  );
}
