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
import { GeneratorInput } from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { createEnhancePrompt } from "@/services/prompt";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PromptEnhancer({
  value,
  onEnhance,
}: {
  value: string;
  onEnhance: (enhancedPrompt: string) => void;
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const enhancePromptMutation = useMutation({
    mutationFn: (enhanceInstruction: string) =>
      createEnhancePrompt(
        `${value}\n\nEnhancement instruction: ${enhanceInstruction}`
      ),
    onSuccess: (enhancedPrompt) => {
      if (enhancedPrompt) {
        onEnhance(enhancedPrompt);
        toast.success("Prompt enhanced successfully!");
        setInput("");
        setOpen(false);
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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 p-2 text-base font-semibold"
            disabled={value.length === 0}
          >
            <Sparkles />
            Enhance Prompt
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Enhance Prompt</DrawerTitle>
            <DrawerDescription>
              Describe how you want to enhance your current prompt. Be specific
              about what improvements you&apos;d like to see.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Current Prompt:
              </label>
              <div className="bg-muted p-3 rounded-md text-sm max-h-32 overflow-y-auto">
                {value || "No prompt content yet..."}
              </div>
            </div>
            <GeneratorInput
              input={input}
              setInput={setInput}
              isLoading={enhancePromptMutation.isPending}
              submit={() => enhancePromptMutation.mutate(input)}
              placeholder="e.g., 'make it more creative', 'add more structure', 'make it more professional'..."
            />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <div className="flex flex-row-reverse items-center justify-between">
                {enhancePromptMutation.isPending ? (
                  <Button
                    className="w-24 bg-muted-foreground hover:bg-muted-foreground"
                    onClick={() => enhancePromptMutation.reset()}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    className="w-24"
                    onClick={() => enhancePromptMutation.mutate(input)}
                  >
                    Enhance
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
          disabled={value.length === 0}
        >
          <Sparkles />
          Enhance Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enhance Prompt</DialogTitle>
          <DialogDescription>
            Describe how you want to enhance your current prompt. Be specific
            about what improvements you&apos;d like to see.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Current Prompt:
            </label>
            <div className="bg-muted p-3 rounded-md text-sm max-h-32 overflow-y-auto">
              {value || "No prompt content yet..."}
            </div>
          </div>
          <GeneratorInput
            input={input}
            setInput={setInput}
            isLoading={enhancePromptMutation.isPending}
            submit={() => enhancePromptMutation.mutate(input)}
            placeholder="e.g., 'make it more creative', 'add more structure', 'make it more professional'..."
          />
        </div>
        <DialogFooter>
          {enhancePromptMutation.isPending ? (
            <Button className="w-24 bg-muted-foreground hover:bg-muted-foreground">
              Loading...
            </Button>
          ) : (
            <Button
              className="w-24"
              onClick={() => enhancePromptMutation.mutate(input)}
            >
              Enhance
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
