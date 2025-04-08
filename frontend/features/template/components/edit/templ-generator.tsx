"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { useTemplate } from "@/context/template-context";
import { ConfigType } from "@/features/template";
import { promptWithConfigGenSchema } from "@/lib/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Sparkles } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { v7 } from "uuid";

export function TemplateGenerator() {
  const [input, setInput] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { token } = useAuth();
  const { template, setTemplate } = useTemplate();

  const { submit, isLoading, stop } = useObject({
    id: template.id,
    api: `${SERVER_URL}/${VERSION_PREFIX}/prompts/generate-template`,
    schema: promptWithConfigGenSchema,
    headers: { Authorization: "Bearer " + token },
    onFinish({ object, error }) {
      if (object) {
        const newTemplate = {
          ...template,
          title: object.title,
          description: object.description,
          stringTemplate: object.stringTemplate,
          systemInstruction: object.systemInstruction,
          configs: object.configs.map((config) => {
            const configId = v7();

            return {
              ...config,
              type: config.type as ConfigType,
              id: configId,
              promptId: template.id,
              values: config.values.map((value) => {
                return {
                  ...value,
                  id: v7(),
                  promptConfigId: configId,
                };
              }),
            };
          }),
        };

        setTemplate(newTemplate);
      }

      setInput("");
      setOpen(false);

      // error, undefined if schema validation succeeds:
      if (error) {
        console.error("Schema validation error:", error);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 p-2 text-base font-semibold"
          onClick={() => {}}
        >
          <Sparkles />
          Generate Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Template</DialogTitle>
          <DialogDescription>
            Type what kind of prompt configurations you want to generate. At
            least 20 characters. Click Generate when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          //ref={textareaRef}
          placeholder="Create a prompt that..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] max-h-[calc(75dvh)] overflow-auto resize-none rounded-xl !text-base bg-muted"
          rows={3}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error("Please wait for the AI to finish its generating!");
              } else {
                submit({ prompt: input });
              }
            }
          }}
        />
        <DialogFooter>
          {isLoading ? (
            <Button
              className="w-24 bg-muted-foreground hover:bg-muted-foreground"
              onClick={() => stop()}
            >
              Stop
            </Button>
          ) : (
            <Button
              className="w-24"
              onClick={() => submit({ prompt: input })}
              disabled={input.trim().length < 20}
            >
              Generate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
