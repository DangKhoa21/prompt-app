"use client";

import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { useRef, useState } from "react";

interface EditTextFieldProps {
  text: string;
  label: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  className?: string;
}

export function EditTextField({
  text,
  label,
  handleChange,
  editable = true,
  className,
}: EditTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleBlur = () => setIsEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col gap-1 md:gap-0 md:flex-row justify-start md:items-center">
      <div className={cn("text-xl font-semibold md:basis-1/5", className)}>
        {label[0].toUpperCase()}
        {label.slice(1)}
      </div>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("md:basis-4/5", className)}
        />
      ) : (
        <div
          onClick={handleEdit}
          className={cn(
            "md:basis-4/5 text-base font-medium p-2 w-full text-wrap rounded-md",
            editable ? " hover:bg-accent" : "",
            className,
          )}
        >
          {text || "Click to add title..."}
        </div>
      )}
    </div>
  );
}
