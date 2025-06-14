"use client";

import CreatorAvatar from "@/components/creator-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStarPrompt, useUnstarPrompt } from "@/features/template";
import { cn, createPromptDetailURL, formatRating } from "@/lib/utils";
import { getPrompt, getPromptTemplate } from "@/services/prompt";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { useQueryClient } from "@tanstack/react-query";
import { ChartColumn, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export function PromptTemplateCard({
  id,
  title,
  description,
  creator,
  hasStarred,
  starCount,
  filter,
}: PromptCard & { filter?: PromptFilter }) {
  const rating = formatRating(starCount);
  const detailURL = createPromptDetailURL(id, title);
  const starMutation = useStarPrompt({ filter, promptId: id });
  const unstarMutation = useUnstarPrompt({ filter, promptId: id });
  const router = useRouter();

  const handleStar = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (hasStarred) {
      unstarMutation.mutate(id);
    } else {
      starMutation.mutate(id);
    }
  };

  const queryClient = useQueryClient();
  const triggerRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ["template", id],
        queryFn: () => getPromptTemplate(id),
      });
      queryClient.prefetchQuery({
        queryKey: ["prompt", id],
        queryFn: () => getPrompt(id),
      });
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={detailURL}>
        <Card className="border-2 rounded-3xl w-80 h-52 transition-all hover:scale-105">
          <CardHeader className="space-y-1 px-4 pt-2 pb-1">
            <CardTitle className="flex items-start justify-between mt-2 text-xl">
              <div className="pl-1 line-clamp-2">{title}</div>
              <div className="flex flex-col gap-1 items-center">
                <Badge
                  variant="secondary"
                  className="flex border-2 items-center gap-1 ml-2 group"
                  onClick={(event) => handleStar(event)}
                >
                  <Star
                    className={cn("h-3 w-3 group-hover:fill-primary", {
                      "fill-primary": hasStarred,
                    })}
                  />
                  {rating}
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex border-2 items-center gap-1 ml-2 bg-transparent hover:bg-transparent text-muted-foreground"
                >
                  <ChartColumn className="h-3 w-3" />0
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-2">
            <div className="text-sm text-foreground line-clamp-2">
              {description}
            </div>
          </CardContent>
          <Separator
            orientation="horizontal"
            className="w-auto mx-4 my-1 bg-neutral-800"
          />
          <CardFooter className="justify-between pt-2 pb-4 items-center">
            <CreatorAvatar username={creator.username ?? "Unknown"} />

            <Button
              variant="link"
              className="text-xs text-foreground border-2 rounded-2xl"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (filter?.creatorId == creator.id) {
                  router.push(`/templates/${id}`);
                } else {
                  router.push(`/?promptId=${id}`);
                }
              }}
            >
              {filter?.creatorId === creator.id ? "Edit" : "Try it now"}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
