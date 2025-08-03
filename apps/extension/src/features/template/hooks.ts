"use client";

import { pinPrompt, unpinPrompt } from "@/services/prompt-pin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePinPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pinPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "pinned-prompts"] });
      toast.success("New prompt pinned!");
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};

export const useUnpinPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpinPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "pinned-prompts"] });
      toast.success("Prompt unpinned!");
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};
