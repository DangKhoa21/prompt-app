import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl font-medium">{label}</CardTitle>
        <Button
          variant="ghost"
          className={cn("h-8 p-2 text-base font-semibold mr-2 mt-1", {
            "text-muted-foreground": enhancePromptMutation.isPending,
          })}
          disabled={enhancePromptMutation.isPending}
          onClick={() => {
            if (!enhancePromptMutation.isPending) {
              enhancePromptMutation.mutate(value);
            }
          }}
        >
          <Sparkles />
          {enhancePromptMutation.isPending ? "Enhancing..." : "Enhance Prompt"}
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={placeholder}
          className="min-h-[200px] border border-slate-500"
          value={value}
          onChange={(e) => {
            handleTextareaChange(e.target.value);
          }}
        />
      </CardContent>
    </Card>
  );
}
