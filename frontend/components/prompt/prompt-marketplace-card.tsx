import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatRating } from "@/lib/utils";
import { PromptCard } from "@/services/prompt/interface";
import { Star } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { starPrompt, unstarPrompt } from "@/services/star";
import { toast } from "sonner";
import { InfiniteData } from "@tanstack/react-query";
import { Paginated } from "@/services/shared";

export function PromptMarketplaceCard({
  id,
  variant,
  tagId,
  title,
  description,
  stringTemplate,
  creator,
  hasStarred,
  starCount,
}: PromptCard & { variant?: "default" | "hover"; tagId?: string }) {
  const rating = formatRating(starCount);

  const queryClient = useQueryClient();
  const starMutation = useMutation({
    mutationFn: starPrompt,
    onSuccess: () => {
      queryClient.setQueryData(
        ["prompts", tagId],
        (oldData: InfiniteData<Paginated<PromptCard>>) => {
          const newPages = oldData.pages.map((group) => {
            const newGroup = group.data.map((p) => {
              if (p.id === id) {
                return { ...p, hasStarred: true, starCount: p.starCount + 1 };
              }
              return p;
            });
            return { ...group, data: newGroup };
          });
          return { ...oldData, pages: newPages };
        }
      );
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });

  const unstarMutation = useMutation({
    mutationFn: unstarPrompt,
    onSuccess: () => {
      queryClient.setQueryData(
        ["prompts", tagId],
        (oldData: InfiniteData<Paginated<PromptCard>>) => {
          const newPages = oldData.pages.map((group) => {
            const newGroup = group.data.map((p) => {
              if (p.id === id) {
                return { ...p, hasStarred: false, starCount: p.starCount - 1 };
              }
              return p;
            });
            return { ...group, data: newGroup };
          });
          return { ...oldData, pages: newPages };
        }
      );
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });

  const handleStar = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (hasStarred) {
      unstarMutation.mutate(id);
    } else {
      starMutation.mutate(id);
    }
  };

  if (variant === "hover") {
    return (
      <div className="bg-card overflow-hidden">
        <Link href={`/?promptId=${id}`}>
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
      </div>
    );
  }

  return (
    <Link href={`/?promptId=${id}`}>
      <Card className="bg-card rounded-3xl h-52 flex flex-col">
        <CardHeader className="space-y-1 px-4 pt-2 pb-1">
          <CardTitle className="flex items-start justify-between mt-2 text-xl">
            <div className="pl-1">{title}</div>
            <Badge
              variant="secondary"
              className="flex border-2 items-center gap-1 ml-2"
              onClick={(event) => handleStar(event)}
            >
              <Star
                className={cn("h-3 w-3", {
                  "fill-primary": hasStarred,
                })}
              />
              {rating}
            </Badge>
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
            <div className="flex flex-row gap-2 t-2 items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-xs text-foreground-accent">
                by {creator["username"]}
              </div>
            </div>
            <div className="t-2 text-xs text-foreground">Try it now</div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
