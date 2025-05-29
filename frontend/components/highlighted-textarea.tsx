"use client";

import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/context/template-context";
import { useEffect, useRef, useState } from "react";
import { useAutoResizeTextarea } from "./use-auto-resize-textarea";
import { cn } from "@/lib/utils";

const config: Record<string, string> = {
  topic: "#fde68a",
  additional_notes: "#bfdbfe",
};

function getContrastTextColor(bgColor: string): string {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#111827" : "#ffffff";
}

function parseTemplateText(text: string): string {
  return text
    .replace(/\${(.*?)}/g, (_, key) => `{{ ${key.trim()} }}`)
    .replace(/{{(.*?)}}/g, (_, key) => `{{ ${key.trim()} }}`);
}

function renderHighlightedText(text: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  const regex = /{{(.*?)}}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(<span key={lastIndex}>{before}</span>);

    const key = match[1].trim();
    const bgColor = config[key] || "#e5e7eb";
    const textColor = getContrastTextColor(bgColor);

    parts.push(
      <span
        key={match.index}
        className="rounded transition-colors duration-200"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {`{{ ${key} }}`}
      </span>,
    );

    lastIndex = regex.lastIndex;
  }

  const after = text.slice(lastIndex);
  if (after) parts.push(<span key={lastIndex}>{after}</span>);

  return parts;
}

interface HighlightedTextareaProps {
  id: string;
  value: string;
}

export default function HighlightedTextarea({
  id,
  value,
}: HighlightedTextareaProps) {
  const parsedText = parseTemplateText(value);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { textareaRef } = useAutoResizeTextarea(parsedText);
  const [focused, setFocused] = useState(false);

  const { template, setTemplate } = useTemplate();

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
  }, [textareaRef]);

  const handleTextareaChange = (newValue: string) => {
    setTemplate({
      ...template,
      [id]: newValue,
    });
  };

  return (
    <div className="relative w-full font-normal text-base md:text-sm leading-loose tracking-wider">
      <div
        ref={backdropRef}
        className={cn(
          "absolute inset-0 overflow-auto whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 transition-opacity duration-200 pointer-events-none",
          focused ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        {renderHighlightedText(parsedText)}
      </div>

      <Textarea
        ref={textareaRef}
        value={parsedText}
        className={cn(
          "relative z-10 bg-transparent transition-colors duration-200",
          focused ? "text-inherit" : "text-transparent",
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => handleTextareaChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
