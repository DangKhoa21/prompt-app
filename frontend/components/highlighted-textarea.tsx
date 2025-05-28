"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const config: Record<string, string> = {
  name: "#fde68a",
  id: "#bfdbfe",
};

function highlightText(text: string) {
  return text.replace(/{{(.*?)}}/g, (_, key) => {
    const color = config[key] || "#e5e7eb";
    return `<span class="rounded" style="background-color: ${color}">{{${key}}}</span>`;
  });
}

// TODO: matching color for easy looking
export default function HighlightedTextarea() {
  const [text, setText] = useState("Hello, {{name}}!\nThis is your ID: {{id}}");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const backdrop = backdropRef.current;

    if (!textarea || !backdrop) return;

    const syncScroll = () => {
      backdrop.scrollTop = textarea.scrollTop;
      backdrop.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, []);

  return (
    <div className="relative w-full text-base md:text-sm leading-relaxed tracking-normal">
      {/* Highlighted background layer */}
      {/* "flex min-h-[80px] w-full bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" */}
      <div
        ref={backdropRef}
        className="w-full absolute inset-0 overflow-auto whitespace-pre-wrap break-words pointer-events-none rounded-md border border-transparent px-3 py-2"
        aria-hidden
      >
        <div dangerouslySetInnerHTML={{ __html: highlightText(text) }} />
      </div>

      {/* Transparent Textarea from shadcn/ui */}
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="relative z-10 bg-transparent"
        spellCheck={false}
      />
    </div>
  );
}
