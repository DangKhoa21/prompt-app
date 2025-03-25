import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

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
}: MarketplacePromptCardProps) {
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

  if (variant === "hover") {
    return (
      <div className="bg-card overflow-hidden">
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
      </div>
    );
  } else if (variant === "carousel") {
    return (
      <>
        <div className="p-1">
          <Card className="bg-card rounded-3xl w-48 h-36 md:w-64 md:h-48 flex flex-col">
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
              </CardFooter>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <Card className="bg-card rounded-3xl h-56 flex flex-col">
      <Link href={detailURL} className="h-full">
        <CardHeader className="space-y-1 px-4 pt-2 pb-0 h-full">
          <CardTitle className="flex relative h-full w-full mt-2 text-xl">
            <div className="flex h-full w-full text-center justify-center items-center">
              {title}
            </div>
            <Badge
              variant="secondary"
              className="absolute right-0 top-0 flex border-2 items-center gap-1 ml-2 opacity-25 hover:opacity-100"
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
      </Link>
      <div>
        <Link href={detailURL}>
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
            <Button
              variant="secondary"
              className="t-2 text-xs text-foreground rounded-2xl"
              asChild
            >
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/?promptId=${id}`);
                }}
              >
                Try it now
              </Button>
            </Button>
          </CardFooter>
        </Link>
      </div>
    </Card>
  );
}
