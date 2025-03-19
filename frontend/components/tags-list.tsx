"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getTags } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TagsList() {
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tagId");
  const sort = searchParams.get("sort") || "newest";
  const router = useRouter();

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const sortOptions = [
    { id: "newest", name: "Newest" },
    { id: "oldest", name: "Oldest" },
    { id: "most-starred", name: "Most Starred" },
  ];

  const updateParams = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.length) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const updateTagId = React.useCallback(
    (id: string) => {
      updateParams("tagId", id === tagId ? "" : id);
    },
    [tagId, updateParams],
  );

  const updateSort = React.useCallback(
    (sort: string) => {
      updateParams("sort", sort);
    },
    [updateParams],
  );

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 200;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  if (isTagsLoading) {
    return null;
  }

  if (isTagsError) {
    return <span>Error: {tagsError.message}</span>;
  }

  return (
    <motion.div
      key="taglist"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.4 }}
      className={cn("sticky top-14 pt-1 pb-2 z-10 bg-background mb-4", {
        "border-b": scrolled,
      })}
    >
      <div className="flex justify-between items-center px-3">
        <div className="flex-1 max-w-xl sm:max-w-4xl mr-auto relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

          <Carousel
            className="w-full"
            opts={{ align: "start", dragFree: true, dragThreshold: 3 }}
          >
            <CarouselContent className="-ml-2">
              {tagsData.map((tag) => (
                <CarouselItem
                  key={tag.id}
                  className="pl-4 basis-auto min-w-fit"
                >
                  <Button
                    variant={tag.id === tagId ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("rounded-2xl px-4 whitespace-nowrap h-9", {
                      "text-muted-foreground": tag.id !== tagId,
                    })}
                    onClick={() => updateTagId(tag.id)}
                  >
                    {tag.name}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={sort === option.id}
                onCheckedChange={() => updateSort(option.id)}
              >
                {option.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
