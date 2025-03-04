"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
    <div className="w-full flex flex-row justify-start items-center m-1">
      <div className={cn("text-xl font-semibold basis-1/5", className)}>
        {label[0].toUpperCase()}
        {label.slice(1)}:
      </div>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("basis-4/5", className)}
        />
      ) : (
        <div
          onClick={handleEdit}
          className={cn(
            "basis-4/5 text-2xl font-semibold p-1 w-full text-wrap",
            editable ? " hover:bg-accent" : "",
            className,
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
}
