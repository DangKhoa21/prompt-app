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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { useTemplate } from "@/context/template-context";
import { ConfigType, GeneratorInput } from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { promptWithConfigGenSchema } from "@/lib/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Sparkles } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { v7 } from "uuid";

interface TemplateGeneratorProps {
  improvementSuggestions: string;
  isImprove: boolean;
  setIsImprove: Dispatch<SetStateAction<boolean>>;
}

export function TemplateGenerator({
  improvementSuggestions,
  isImprove,
  setIsImprove,
}: TemplateGeneratorProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
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
              info: config.info,
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

  useEffect(() => {
    if (isImprove) {
      setIsImprove(false);
      submit({ prompt: improvementSuggestions });
    }
  }, [improvementSuggestions, isImprove, setIsImprove, submit]);

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 p-2 text-base font-semibold"
            onClick={() => {}}
          >
            <Sparkles />
            Generate Template
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Generate Template</DrawerTitle>
            <DrawerDescription>
              Type what kind of prompt configurations you want to generate. At
              least 20 characters. Click Generate when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-2 ">
            <GeneratorInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              submit={submit}
              placeholder="e.g., 'Create a prompt that generates creative writing prompts', 'Generate a template for coding challenges', etc."
            />
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <div className="flex flex-row-reverse items-center justify-between">
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
                <Button variant="outline">Cancel</Button>
              </div>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

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
        <GeneratorInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          submit={submit}
          placeholder="e.g., 'Create a prompt that generates creative writing prompts', 'Generate a template for coding challenges', etc."
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
