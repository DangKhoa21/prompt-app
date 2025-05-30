"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddNewTemplateButton } from "@/features/template";
import { getStarredPrompts } from "@/services/prompt";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";

interface TemplatesSearchProp {
  filter: PromptFilter;
}

export function TemplatesSearch({ filter }: TemplatesSearchProp) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const handleSearch = useDebounceCallback((search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search.length) params.set("search", search);
    else params.delete("search");
    router.push(`?${params.toString()}`);
  }, 500);

  const handeTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab == "starred") params.set("tab", tab);
    else params.delete("tab");
    router.push(`?${params.toString()}`);
  };
  const queryClient = useQueryClient();

  const prefetchPrompts = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", filter],
      queryFn: ({ pageParam }) => getStarredPrompts({ pageParam, filter }),
      initialPageParam: "",
      getNextPageParam: (lastPage: Paginated<PromptCard>) =>
        lastPage.nextCursor,
    });
  };

  return (
    <motion.div
      key="marketsearch"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.3 }}
      className="sticky top-2.5 z-20 flex items-start justify-center gap-4 w-3/5 max-w-screen-lg mx-auto"
    >
      <div className="inline-flex relative mb-6 w-full justify-center">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-9"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("search")?.toString()}
        />
      </div>

      <Tabs
        defaultValue={searchParams.get("tab") || "created"}
        onValueChange={handeTabChange}
        className="w-[220px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">
            {isMobile ? "Cr" : "Created"}
          </TabsTrigger>
          <TabsTrigger value="starred" onMouseEnter={prefetchPrompts}>
            {isMobile ? "St" : "Starred"}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AddNewTemplateButton />
    </motion.div>
  );
}
