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
import { getPrompts, viewPrompt } from "@/services/prompt";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebounceCallback } from "usehooks-ts";
import { sendMessage } from "@/lib/messaging";
import { PromptPinItem } from "@/services/prompt-pin/interface";
import { getPinnedPrompts } from "@/services/prompt-pin";
import { useAuth } from "@/context/auth-context";

export function PromptSearch() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["prompts", searchQuery],
      queryFn: ({ pageParam }) =>
        getPrompts({ pageParam, filter: { search: searchQuery } }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const {
    data: pinnedPrompts,
    isPending,
    isError,
  } = useQuery<Array<PromptPinItem>>({
    queryKey: ["users", "pinned-prompts"],
    queryFn: getPinnedPrompts,
    enabled: isAuthenticated,
  });

  const filteredPrompts = data?.pages.flatMap((page) =>
    page.data.filter((prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredPinnedPrompts = pinnedPrompts?.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePromptChange = (promptId: string) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = new URL(currentTab.url || "");
      const params = new URLSearchParams(url.search);
      params.set("promptId", promptId);
      if (currentTab) {
        sendMessage(
          "replaceCurrentUrl",
          { url: `${url.origin}${url.pathname}?${params.toString()}` },
          currentTab.id
        );
      }
    });
    setOpen(false);

    viewPrompt(promptId); // no error handling needed for now
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
            {status === "error" || isError
              ? "Failed to search prompts."
              : searchQuery.length === 0 ||
                (filteredPinnedPrompts?.length === 0 &&
                  filteredPrompts?.length === 0)
              ? "No results found."
              : status === "pending" || isPending
              ? "Loading..."
              : null}
          </CommandEmpty>

          {filteredPinnedPrompts && filteredPinnedPrompts?.length > 0 && (
            <CommandGroup heading="Pinned">
              {filteredPinnedPrompts.map((prompt) => (
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
            </CommandGroup>
          )}

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
