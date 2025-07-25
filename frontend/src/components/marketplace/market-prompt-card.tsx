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
import { getPrompt, viewPrompt } from "@/services/prompt";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { useQueryClient } from "@tanstack/react-query";
import { ChartColumn, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

interface MarketplacePromptCardProps extends PromptCard {
  variant?: "default" | "hover" | "carousel";
  filter?: PromptFilter;
}

export function MarketplacePromptCard({
  id,
  variant,
  filter,
  title,
  description,
  stringTemplate,
  creator,
  hasStarred,
  starCount,
  usageCount,
  viewCount,
}: MarketplacePromptCardProps) {
  const rating = formatRating(starCount);
  const usage = formatRating(usageCount);
  const view = formatRating(viewCount);
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
        queryKey: ["prompt", id],
        queryFn: () => getPrompt(id),
      });
    }, 150); // slight delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  function CardWrapper({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => viewPrompt(id)}
        className={className}
      >
        {children}
      </div>
    );
  }

  if (variant === "hover") {
    return (
      <CardWrapper className="bg-card overflow-hidden">
        <Link href={detailURL}>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="pl-1">Prompt Details</div>
            <Badge
              variant="secondary"
              className="flex border-2 items-center p-1 ml-2"
              onClick={(event) => handleStar(event)}
            >
              <Star
                className={cn("h-4 w-4 hover:fill-primary", {
                  "fill-primary": hasStarred,
                })}
              />
            </Badge>
          </CardTitle>
          <div className="overflow-y-auto max-h-96">
            <div className="text-sm text-foreground p-1 mt-3">
              {description}
            </div>
            <Separator
              orientation="horizontal"
              className="w-auto my-1 bg-neutral-800"
            />
            <div className="mt-2">
              <div className="p-1 font-semibold text-base">Template</div>
              <div className="text-sm text-foreground p-1">
                {stringTemplate}
              </div>
            </div>
          </div>
        </Link>
      </CardWrapper>
    );
  } else if (variant === "carousel") {
    return (
      <CardWrapper className="p-1">
        <Card className="border-2 rounded-3xl max-w-80 h-52 md:w-64 md:h-48 flex flex-col">
          <Link href={detailURL} className="h-full">
            <CardHeader className="space-y-1 px-4 pt-2 pb-0 h-full">
              <CardTitle className="flex relative h-full w-full mt-2 text-xl">
                <div className="flex h-full w-full text-center justify-center items-center">
                  {title}
                </div>
                <Badge
                  variant="secondary"
                  className="absolute right-0 top-0 flex border-2 items-center gap-1 ml-2 opacity-25 hober:opacity-100"
                >
                  <Star
                    className={cn("h-3 w-3", {
                      "fill-primary": hasStarred,
                    })}
                  />
                  {formatRating(starCount)}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Link>
          <div>
            <Link href={`${title.toLowerCase().replace(" ", "-")}-i${id}`}>
              <Separator
                orientation="horizontal"
                className="w-auto mx-4 my-1 bg-neutral-800"
              />
            </Link>
            <CardFooter className="justify-between pt-2 pb-3 items-center">
              <CreatorAvatar username={creator?.username ?? "Unknown"} />
            </CardFooter>
          </div>
        </Card>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Link href={detailURL}>
        <Card className="border-2 rounded-3xl max-w-80 h-52 flex flex-col transition-all hover:scale-105">
          <CardHeader className="space-y-1 px-4 pt-2 pb-1">
            <CardTitle className="flex items-start justify-between mt-2 text-xl">
              <div className="pl-1 line-clamp-2">{title}</div>
              <div className="flex flex-col gap-1 items-end">
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
                <div className="flex flex-row items-center">
                  <Badge
                    variant="secondary"
                    className="flex border-2 items-center gap-1 ml-2 bg-transparent hover:bg-transparent text-muted-foreground"
                  >
                    <ChartColumn className="h-3 w-3" />
                    {usage}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex border-2 items-center gap-1 ml-2 bg-transparent hover:bg-transparent text-muted-foreground"
                  >
                    <Eye className="h-3 w-3" />
                    {view}
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <div className="mt-auto">
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
              <CreatorAvatar username={creator?.username ?? "Unknown"} />

              <Button
                variant="link"
                className="text-xs text-foreground border-2 rounded-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  viewPrompt(id);
                  router.push(`/?promptId=${id}`);
                }}
              >
                Try it now
              </Button>
            </CardFooter>
          </div>
        </Card>
      </Link>
    </CardWrapper>
  );
}
