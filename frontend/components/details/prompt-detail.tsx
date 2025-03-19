"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getPrompt, getTagsForTemplate } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface PromptDetailProps {
  promptId: string;
  className?: string;
}

export default function PromptDetail({
  promptId,
  className,
}: PromptDetailProps) {
  const {
    isPending: isPromptPending,
    isError: isPromptError,
    data: promptData,
    error: promptError,
  } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: () => getPrompt(promptId),
  });

  const {
    isPending: isTagsPending,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags", promptId],
    queryFn: () => getTagsForTemplate(promptId),
  });

  if (isPromptPending || isTagsPending) {
    return (
      <>
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      </>
    );
  }

  if (isPromptError || isTagsError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Error:{" "}
        {promptError
          ? promptError.message
          : tagsError
            ? tagsError.message
            : "Can not load prompt or tags"}
      </div>
    );
  }

  console.log(tagsData);

  return (
    <>
      <div
        className={cn("md:border-2 md:rounded-lg md:p-4 space-y-4", className)}
      >
        <div className="flex relative items-center gap-4">
          <Image
            src={`https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80`}
            alt="Photo by Drew Beamer"
            fill
            className="absolute inset-x-0 top-0 h-full w-full rounded-xl shadow-xl z-0 opacity-40 object-cover"
          ></Image>
          <div className="basis-1/3 my-8 flex justify-center">
            <Image
              src={`https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80`}
              alt="Photo by Drew Beamer"
              width={160}
              height={160}
              className="h-40 w-40 rounded-lg"
            ></Image>
          </div>
          <div className="basis-2/3 p-2 space-y-4">
            <div className="text-2xl font-semibold">{promptData.title}</div>
            <div className="flex gap-2">
              {tagsData.length
                ? tagsData.map((tag, i) => (
                    <Badge key={`tags-${i}`}>{tag.name}</Badge>
                  ))
                : "No tags"}
            </div>
            <div className="flex flex-col gap-2">
              <div className="italic">
                Created at:{" "}
                {new Date(promptData.createdAt).toLocaleDateString()}
              </div>
              <div className="italic">
                Latest update:{" "}
                {new Date(promptData.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div className="text-md md:m-4">{promptData.description}</div>
        <div className="text-md md:m-2">Example results:</div>
        <ScrollArea className="border rounded-lg m-2 p-8 h-[32rem]">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed
            odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor
            id nibh ultricies vehicula ut id elit. Curabitur blandit tempus
            porttitor. Integer posuere erat a ante venenatis dapibus posuere
            velit aliquet.Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Nulla vitae elit libero, a
            pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id
            elit. Curabitur blandit tempus porttitor. Integer posuere erat a
            ante venenatis dapibus posuere velit aliquet.Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Praesent commodo cursus magna,
            vel scelerisque nisl consectetur et. Donec sed odio dui. Nulla vitae
            elit libero, a pharetra augue. Nullam id dolor id nibh ultricies
            vehicula ut id elit. Curabitur blandit tempus porttitor. Integer
            posuere erat a ante venenatis dapibus posuere velit aliquet.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo
            cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
            dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id
            nibh ultricies vehicula ut id elit. Curabitur blandit tempus
            porttitor. Integer posuere erat a ante venenatis dapibus posuere
            velit aliquet.Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Nulla vitae elit libero, a
            pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id
            elit. Curabitur blandit tempus porttitor. Integer posuere erat a
            ante venenatis dapibus posuere velit aliquet.
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
