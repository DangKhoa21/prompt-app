"use client";

import type React from "react";

import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { useRef, useState } from "react";

interface EditTextAreaProps {
  text: string;
  label: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editable?: boolean;
  className?: string;
  rows?: number;
}

export function EditTextArea({
  text,
  label,
  handleChange,
  editable = true,
  className,
  rows = 3,
}: EditTextAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Set cursor to the end of the text instead of the beginning default behavior
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }
  };

  const handleBlur = () => setIsEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsEditing(false);
    // Allow Enter for new lines in textarea, only Escape to exit
  };

  return (
    <div className="w-full flex flex-col gap-1 md:gap-0 md:flex-row justify-start md:items-start">
      <div
        className={cn("text-xl font-semibold md:basis-1/5 md:pt-2", className)}
      >
        {label[0].toUpperCase()}
        {label.slice(1)}
      </div>
      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={rows}
          className={cn("md:basis-4/5 resize-none", className)}
        />
      ) : (
        <div
          onClick={handleEdit}
          className={cn(
            "md:basis-4/5 text-lg font-normal p-2 w-full text-wrap rounded-md whitespace-pre-wrap",
            editable ? "hover:bg-accent cursor-pointer" : "",
            className
          )}
        >
          {text || "Click to add description..."}
        </div>
      )}
    </div>
  );
}
