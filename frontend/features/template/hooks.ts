"use client";

import {
  createPromptTemplate,
  deletePromptTemplate,
  updatePromptTemplate,
  updateTag,
} from "@/services/prompt";
import { TemplateTag } from "@/services/prompt/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import { starPrompt, unstarPrompt } from "@/services/star";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const handleUpdateTags = ({
    id,
    data,
  }: {
    id: string;
    data: TemplateTag[];
  }) => updateTag(id, data);

  return useMutation({
    mutationFn: handleUpdateTags,
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

export const useStarPrompt = ({
  filter,
  promptId,
}: {
  filter?: PromptFilter;
  promptId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: starPrompt,
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["prompts", filter] },
        (oldData: InfiniteData<Paginated<PromptCard>>) => {
          const newPages = oldData.pages.map((group) => {
            const newGroup = group.data.map((p) => {
              if (p.id === promptId) {
                return { ...p, hasStarred: true, starCount: p.starCount + 1 };
              }
              return p;
            });
            return { ...group, data: newGroup };
          });
          return { ...oldData, pages: newPages };
        }
      );
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};

export const useUnstarPrompt = ({
  filter,
  promptId,
}: {
  filter?: PromptFilter;
  promptId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unstarPrompt,
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["prompts", filter] },
        (oldData: InfiniteData<Paginated<PromptCard>>) => {
          const newPages = oldData.pages.map((group) => {
            const newGroup = group.data.map((p) => {
              if (p.id === promptId) {
                return { ...p, hasStarred: false, starCount: p.starCount - 1 };
              }
              return p;
            });
            return { ...group, data: newGroup };
          });
          return { ...oldData, pages: newPages };
        }
      );
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};
