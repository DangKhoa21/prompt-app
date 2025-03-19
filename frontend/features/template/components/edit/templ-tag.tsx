"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTemplate } from "@/context/template-context";
import { getTags } from "@/services/prompt";
import { TemplateTag } from "@/services/prompt/interface";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TemplateEditTagProps {
  tags: TemplateTag[];
}

export function TemplateEditTag({ tags }: TemplateEditTagProps) {
  const [open, setOpen] = useState(false);

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const { template, setTemplate } = useTemplate();

  if (isTagsLoading) {
    return null;
  }

  if (isTagsError) {
    return <span>Error: {tagsError.message}</span>;
  }

  if (!tagsData) {
    return <span>No tag found.</span>;
  }

  const handleAddTag = (tagId: string, tagName: string) => {
    const addedTag: TemplateTag = {
      id: tagId,
      name: tagName,
    };

    const newTemplate = {
      ...template,
      tags: [...(template.tags || []), addedTag],
    };

    setTemplate(newTemplate);
  };

  const handleDeleteTag = (tagId: string) => {
    const newTemplate = {
      ...template,
      tags: template.tags.filter((tag) => tag.id !== tagId),
    };

    setTemplate(newTemplate);
  };

  const remainingTags: TemplateTag[] = !tags
    ? tagsData
    : tagsData.filter(
        (tag) => !tags.some((existedTag) => tag.id === existedTag.id),
      );

  return (
    <>
      <div className="flex items-center m-1 gap-2">
        <div className="basis-1/5 text-base font-semibold">Tags</div>
        <div className="basis-4/5 flex flex-wrap gap-2">
          {tags?.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="group relative transition-all ease-in-out duration-300 hover:pr-[2.05rem]"
            >
              {tag.name}
              <Button
                variant="ghost"
                className="absolute right-[0.525rem] h-4 w-4 opacity-0 transition-all ease-in-out group-hover:opacity-100 duration-300"
                size="icon"
                onClick={() => {
                  handleDeleteTag(tag.id);
                }}
              >
                <X />
              </Button>
            </Badge>
          ))}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-expanded={open}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search tag..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No remaining tags found.</CommandEmpty>
                  <CommandGroup>
                    {remainingTags.map((remainingTag) => (
                      <CommandItem
                        key={remainingTag.id}
                        value={remainingTag.name}
                        onSelect={(currentValue) => {
                          handleAddTag(remainingTag.id, currentValue);
                          setOpen(false);
                        }}
                      >
                        {remainingTag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}
