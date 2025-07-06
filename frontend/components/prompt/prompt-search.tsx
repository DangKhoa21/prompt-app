"use client";

import { LoadingSpinner } from "@/components/icons";
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
import { getPrompts, viewPrompt } from "@/services/prompt";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PencilRuler, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounceCallback } from "usehooks-ts";

export function PromptSearch() {
  const [open, setOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const debouncedSetQuery = useDebounceCallback((val: string) => {
    setQueryInput(val);
  }, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["prompts", queryInput],
      queryFn: ({ pageParam }) =>
        getPrompts({ pageParam, filter: { search: queryInput } }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const prompts = data?.pages.flatMap((page) => page.data) ?? [];

  const handlePromptChange = (promptId: string) => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("promptId", promptId);
    window.history.replaceState(null, "", `?${params.toString()}`);
    setOpen(false);

    viewPrompt(promptId); // no error handling needed for now
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
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
          onValueChange={debouncedSetQuery}
        />
        <CommandList>
          <CommandEmpty>
            {status === "error"
              ? "Failed to fetch prompts."
              : status === "pending"
              ? "Loading ..."
              : prompts.length === 0
              ? "No results found."
              : null}
          </CommandEmpty>

          {prompts.length > 0 && (
            <CommandGroup heading="Prompts">
              {prompts.map((prompt) => (
                <CommandItem
                  key={prompt.id}
                  value={prompt.id}
                  onSelect={() => handlePromptChange(prompt.id)}
                >
                  <PencilRuler className="mr-2 h-4 w-4" />
                  <div>
                    <div className="line-clamp-2">{prompt.title}</div>
                    <div className="text-xs line-clamp-2 text-muted-foreground">
                      {prompt.description}
                    </div>
                  </div>
                </CommandItem>
              ))}

              <div className="flex justify-center mt-2">
                {isFetchingNextPage && <LoadingSpinner />}
              </div>
              <div ref={ref} className="mt-5" />
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
