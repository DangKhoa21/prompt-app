"use client";

import type React from "react";
import { useRef } from "react";

import { ArrowUp, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function MultimodalInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative w-full flex flex-col gap-4">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        className="min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted"
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
          }
        }}
      />

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        <ArrowUp size={14} />
      </Button>

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
        }}
        variant="outline"
      >
        <Paperclip size={14} />
      </Button>
    </div>
  );
}
