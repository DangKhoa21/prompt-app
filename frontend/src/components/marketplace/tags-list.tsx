"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTags } from "@/hooks/use-tags";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TagsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useTags();

  const tagId = searchParams.get("tagId");
  const sort = searchParams.get("sort") || "newest";

  const sortOptions = [
    { id: "newest", name: "Newest" },
    { id: "oldest", name: "Oldest" },
    { id: "most-starred", name: "Most Starred" },
    { id: "trending", name: "Trending" },
  ];

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.length) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const updateTagId = useCallback(
    (id: string) => {
      updateParams("tagId", id === tagId ? "" : id);
    },
    [tagId, updateParams]
  );

  const updateSort = useCallback(
    (sort: string) => {
      updateParams("sort", sort);
    },
    [updateParams]
  );

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const onScroll = () => {
      const progress = carouselApi.scrollProgress();
      setScrollProgress(progress);
    };

    carouselApi.on("scroll", onScroll);
    onScroll();

    return () => {
      carouselApi.off("scroll", onScroll);
    };
  }, [carouselApi]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

  // TODO:Responsive for tag list
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
        <div className="flex-1 max-w-[300px] md:max-w-[25rem] lg:max-w-[40rem] xl:max-w-[60rem] 2xl:max-w-[75rem] mr-auto relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

          <Carousel
            className="w-full"
            opts={{ align: "start", dragFree: true, dragThreshold: 3 }}
            setApi={setCarouselApi}
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
                    className={cn(
                      "rounded-2xl px-4 whitespace-nowrap h-9 outline-none",
                      {
                        "text-muted-foreground": tag.id !== tagId,
                      }
                    )}
                    onClick={() => updateTagId(tag.id)}
                  >
                    {tag.name}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="w-full h-0.5 bg-muted mt-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>

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
