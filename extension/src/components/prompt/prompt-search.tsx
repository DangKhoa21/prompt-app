"use client";

import * as React from "react";

import { PencilRuler, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LoadingSpinner } from "@/components/icons";

import { getPrompts } from "@/services/prompt";
import { useInfiniteQuery } from "@tanstack/react-query";
//import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useDebounceCallback } from "usehooks-ts";

export function PromptSearch() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchParams = window.location.href;

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["prompts", searchQuery],
      queryFn: ({ pageParam }) =>
        getPrompts({ pageParam, filter: { search: searchQuery } }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const filteredPrompts = data?.pages.flatMap((page) =>
    page.data.filter((prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePromptChange = (promptId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("promptId", promptId);
    window.history.replaceState(null, "", `?${params.toString()}`);
    setOpen(false);
  };

  const handleQueryChange = useDebounceCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        id="prompt-search"
        variant="outline"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <Badge
          className="ml-auto text-muted-foreground font-medium"
          variant="secondary"
        >
          Ctrl + Q
        </Badge>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search..."
          onValueChange={handleQueryChange}
        />
        <CommandList>
          <CommandEmpty>
            {status === "error"
              ? "Failed to search prompts."
              : searchQuery.length === 0 || filteredPrompts?.length === 0
              ? "No results found."
              : status === "pending"
              ? "Loading..."
              : null}
          </CommandEmpty>
          {filteredPrompts && filteredPrompts?.length > 0 && (
            <CommandGroup heading="Prompts">
              {filteredPrompts.map((prompt) => (
                <CommandItem
                  key={prompt.id}
                  value={prompt.id}
                  onSelect={() => handlePromptChange(prompt.id)}
                >
                  <PencilRuler className="mr-2 h-4 w-4" />
                  <div>
                    <div className="line-clamp-2">{prompt.title}</div>
                    <div className="text-xs line-clamp-2">
                      {prompt.description}
                    </div>
                  </div>
                </CommandItem>
              ))}

              <div className="flex justify-center">
                {isFetchingNextPage ? <LoadingSpinner /> : null}
              </div>

              <div ref={ref} className="mt-5" />
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
