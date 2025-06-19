"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/components/use-auto-resize-textarea";
import { cn } from "@/lib/utils";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const config: Record<string, string> = {
  // topic: "#fde68a",
  // additional_notes: "#bfdbfe",
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
  return text.replace(/{{(.*?)}}/g, (_, key) => `{{${key.trim()}}}`);
}

function renderHighlightedText(
  text: string,
  isFocused: boolean,
): JSX.Element[] {
  if (isFocused) return [];
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
        className="inline px-[0.675rem] rounded transition-colors duration-200"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {key}
      </span>,
    );

    lastIndex = regex.lastIndex;
  }

  const after = text.slice(lastIndex);
  if (after) parts.push(<span key={lastIndex}>{after}</span>);
  return parts;
}

interface HighlightedTextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function HighlightedTextarea({
  placeholder,
  value,
  onChange,
}: HighlightedTextareaProps) {
  const [focused, setFocused] = useState(false);
  const [localText, setLocalText] = useState(value);

  const backdropRef = useRef<HTMLDivElement>(null);
  const { textareaRef } = useAutoResizeTextarea(localText);

  // Sync external value into localText when not focused
  useEffect(() => {
    if (!focused) {
      setLocalText(value);
    }
  }, [value, focused]);

  // Sync scroll
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

  const inputTypeRef = useRef<string | null>(null);

  const handleBeforeInput = (e: InputEvent) => {
    inputTypeRef.current = e.inputType;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener(
      "beforeinput",
      handleBeforeInput as EventListener,
    );

    return () => {
      textarea.removeEventListener(
        "beforeinput",
        handleBeforeInput as EventListener,
      );
    };
  }, []);

  // Handle smart typing inside `onChange`
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    const text = el.value;
    const pos = el.selectionStart;

    const inputType = inputTypeRef.current;

    // Only auto-insert `}}` if not deleting
    if (inputType && !inputType.startsWith("delete")) {
      if (pos >= 2 && text.slice(pos - 2, pos) === "{{") {
        const newText = text.slice(0, pos) + "}}" + text.slice(pos);
        setLocalText(newText);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = pos;
            textareaRef.current.selectionEnd = pos;
          }
        });

        return;
      }
    }

    setLocalText(text);
    onChange(e);
  };

  const handleBlur = () => {
    const parsed = parseTemplateText(localText);
    setLocalText(parsed);
    onChange({ target: { value: parsed } } as ChangeEvent<HTMLTextAreaElement>);
    setFocused(false);
  };

  return (
    <div className="group relative w-full font-normal text-base md:text-sm leading-loose tracking-wider">
      <div
        ref={backdropRef}
        className={cn(
          "absolute inset-0 overflow-auto whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 opacity-100 group-focus-within:opacity-0 pointer-events-none",
        )}
        aria-hidden
      >
        {renderHighlightedText(localText, focused)}
      </div>

      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={localText}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onChange={handleChange}
        className={cn(
          "relative z-10 bg-transparent text-transparent group-focus-within:text-inherit",
        )}
        spellCheck={false}
      />
    </div>
  );
}
