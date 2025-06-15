import HighlightedTextarea from "@/components/highlighted-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTemplate } from "@/context/template-context";
import { cn } from "@/lib/utils";
import { createEnhancePrompt } from "@/services/prompt";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
}

export function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
}: configTextareaProp) {
  const { template, setTemplate } = useTemplate();

  const handleTextareaChange = (texting: string) => {
    const newTemplate = {
      ...template,
      [id]: texting,
    };

    setTemplate(newTemplate);
  };

  const enhancePromptMutation = useMutation({
    mutationFn: createEnhancePrompt,
    onSuccess: (enhancedPrompt) => {
      if (enhancedPrompt) {
        const newTemplate = {
          ...template,
          [id]: enhancedPrompt,
        };

        setTemplate(newTemplate);
        toast.success("Prompt enhanced successfully!");
      }
    },
    onError: (e) => {
      try {
        const err = JSON.parse(e.message);
        toast.error(err.message);
      } catch {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-xl font-medium">{label}</CardTitle>
        {id === "stringTemplate" && (
          <Button
            variant="ghost"
            className={cn("h-8 p-2 text-base font-semibold", {
              "text-muted-foreground": enhancePromptMutation.isPending,
            })}
            disabled={enhancePromptMutation.isPending || value.length === 0}
            onClick={() => {
              enhancePromptMutation.mutate(value);
            }}
          >
            <Sparkles />
            {enhancePromptMutation.isPending
              ? "Enhancing..."
              : "Enhance Prompt"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <HighlightedTextarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleTextareaChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
