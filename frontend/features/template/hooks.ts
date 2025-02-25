"use client";

import {
  createPromptTemplate,
  deletePromptTemplate,
  updatePromptTemplate,
  updateTag,
} from "@/services/prompt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreatePromptTemplate = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createPromptTemplate,
    onSuccess: (newTemplateId: string) => {
      router.push(`/templates/${newTemplateId}`);
    },
    onError: (error: string) => {
      console.error("Error creating template:", error);
    },
  });
};

export const useUpdatePromptTemplate = () => {
  return useMutation({
    mutationFn: updatePromptTemplate,
    onSuccess: (res: boolean) => {
      console.log("Updating prompt template status: ", res);
    },
    onError: (error: string) => {
      console.error("Error updating template:", error);
    },
  });
};

export const useUpdateTag = () => {
  return useMutation({
    mutationFn: updateTag,
    onSuccess: (res: boolean) => {
      console.log("Updating tags status: ", res);
    },
    onError: (error: string) => {
      console.error("Error updating tags:", error);
    },
  });
};

export const useDeletePromptTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromptTemplate,
    onSuccess: (deletedId) => {
      console.log("Deleting prompt template: ", deletedId);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error: string) => {
      console.error("Error creating template:", error);
    },
  });
};
