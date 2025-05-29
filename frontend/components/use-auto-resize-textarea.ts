import { useCallback, useEffect, useRef } from "react";

export function useAutoResizeTextarea(input: string) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, []);

  const resetHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px"; // Make this a param if needed
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [adjustHeight]);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  return { textareaRef, adjustHeight, resetHeight };
}
