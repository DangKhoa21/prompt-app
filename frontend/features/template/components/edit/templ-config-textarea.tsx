"use client";

import HighlightedTextarea from "@/components/highlighted-textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/components/use-auto-resize-textarea";
import { PromptEnhancer } from "@/features/template";
import { useTemplate } from "@/context/template-context";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  highlight?: boolean;
}

export function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
  highlight = false,
}: configTextareaProp) {
  const { template, setTemplate } = useTemplate();
  const { textareaRef } = useAutoResizeTextarea(value);
  const handleTextareaChange = (texting: string) => {
    const newTemplate = {
      ...template,
      [id]: texting,
    };

    setTemplate(newTemplate);
  };

  const handleEnhance = (enhancedPrompt: string) => {
    const newTemplate = {
      ...template,
      [id]: enhancedPrompt,
    };
    setTemplate(newTemplate);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-xl font-medium">{label}</CardTitle>
        {id === "stringTemplate" && (
          <PromptEnhancer value={value} onEnhance={handleEnhance} />
        )}
      </CardHeader>
      <CardContent>
        {highlight ? (
          <HighlightedTextarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleTextareaChange(e.target.value)}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleTextareaChange(e.target.value)}
          />
        )}
      </CardContent>
    </Card>
  );
}
