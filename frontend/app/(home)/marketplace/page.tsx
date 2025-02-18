import React, { Suspense } from "react";

import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/icons";
import { Search } from "lucide-react";

import PromptHoverCard from "@/components/prompt/prompt-hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPrompts, getTags } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

// TODO: Seeding more data based on the following sample data
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

  const noTags = 2;
  const tags = tagsData.slice(0, noTags);
  const remainingTags = tagsData.slice(noTags);
import TagsList from "@/components/marketplace/tagslist";
import PromptsList from "@/components/marketplace/promptslist";

export default async function Page(props: {
  searchParams?: Promise<{
    tagId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tagId = searchParams?.tagId || "";

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <div className="w-2/3 mx-auto">
            <p className="text-muted-foreground mb-4">
              Discover and create custom versions prompts that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>
          <div className="inline-flex relative mb-2 w-3/5 max-w-screen-lg justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {tags.map((filter, i) => (
            <Button
              key={i}
              variant="secondary"
              size="sm"
              className="rounded-2xl gap-1 px-4"
            >
              {filter.name}
            </Button>
          ))}
          {remainingTags.length !== 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-2xl gap-1 px-4"
                >
                  More
                  <ChevronDown className="mr-[-0.25rem] h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                {/* <DropdownMenuGroup> */}
                {/*   <DropdownMenuItem> */}
                {/*     Profile */}
                {/*     <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                {/*   </DropdownMenuItem> */}
                {/*   <DropdownMenuItem> */}
                {/*     Billing */}
                {/*     <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                {/*   </DropdownMenuItem> */}
                {/*   <DropdownMenuItem> */}
                {/*     Settings */}
                {/*     <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                {/*   </DropdownMenuItem> */}
                {/*   <DropdownMenuItem> */}
                {/*     Keyboard shortcuts */}
                {/*     <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
                {/*   </DropdownMenuItem> */}
                {/* </DropdownMenuGroup> */}
                {remainingTags.map((filter, i) => (
                  <DropdownMenuItem key={i}>{filter.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            ""
          )}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PromptsList tagId={tagId} />
        </Suspense>
      </div>
    </div>
  );
}
