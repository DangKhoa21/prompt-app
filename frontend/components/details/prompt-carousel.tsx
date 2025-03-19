"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn, formatRating } from "@/lib/utils";
import { PromptCard } from "@/services/prompt/interface";
import { Star } from "lucide-react";
import Link from "next/link";

interface PromptCarouselProps {
  label: string;
  prompts: PromptCard[];
}

export default function PromptCarousel({
  label,
  prompts,
}: PromptCarouselProps) {
  const { open } = useSidebar();

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="ml-4 text-2xl font-semibold">{label}:</div>
        <Carousel
          className={cn(
            "w-full mx-auto max-w-[360px]",
            open
              ? "md:max-w-xl lg:max-w-3xl xl:max-w-5xl"
              : "md:max-w-2xl lg:max-w-4xl xl:max-w-6xl",
          )}
          opts={{ align: "start", dragFree: true, dragThreshold: 3 }}
        >
          <CarouselContent className="w-full">
            {prompts.map(
              ({ id, title, creator, starCount, hasStarred }, index) => (
                <CarouselItem key={index} className="basis-auto min-w-fit">
                  <div className="p-1">
                    <Card className="bg-card rounded-3xl w-72 h-56 flex flex-col">
                      <Link
                        href={`${title.toLowerCase().replace(" ", "-")}-i${id}`}
                        className="h-full"
                      >
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
                        <Link
                          href={`${title.toLowerCase().replace(" ", "-")}-i${id}`}
                        >
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
                </CarouselItem>
              ),
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}
