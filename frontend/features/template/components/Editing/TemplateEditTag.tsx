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
import { getTags } from "@/services/prompt";
import { TemplateTag, TemplateWithConfigs } from "@/services/prompt/interface";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface TemplateEditTagProps {
  tags: TemplateTag[];
  setPromptData: Dispatch<SetStateAction<TemplateWithConfigs>>;
}

export function TemplateEditTag({ tags, setPromptData }: TemplateEditTagProps) {
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
    setPromptData((prevState) => ({
      ...prevState,
      tags: [...(prevState.tags || []), addedTag],
    }));
  };

  const handleDeleteTag = (tagId: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const remainingTags: TemplateTag[] = !tags
    ? tagsData
    : tagsData.filter(
        (tag) => !tags.some((existedTag) => tag.id === existedTag.id),
      );

  return (
    <>
      <div className="flex items-center gap-2">
        <div>Tags: </div>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, i) => (
            <Badge key={i} variant="secondary" className="group">
              {tag.name}
              <Button
                variant="default"
                className="mx-2 h-6 w-6 hidden group-hover:flex"
                size="icon"
                onClick={() => {
                  handleDeleteTag(tag.id);
                }}
              >
                <X />
              </Button>
            </Badge>
          ))}
        </div>

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
                <CommandEmpty>No remaining tag found.</CommandEmpty>
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
    </>
  );
}
