"use client";

import {
  createPromptTemplate,
  deletePromptTemplate,
  evaluatePrompt,
  generateResult,
  updatePromptResult,
  updatePromptTemplate,
  updateTag,
} from "@/services/prompt";
import { pinPrompt, unpinPrompt } from "@/services/prompt-pin";
import {
  PromptCard,
  PromptFilter,
  TemplateTag,
} from "@/services/prompt/interface";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPromptTemplate,
    onSuccess: (newTemplateId: string) => {
      router.push(`/templates/${newTemplateId}`);
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: (error: string) => {
      console.error("Error creating template:", error);
    },
  });
};

export const useUpdatePromptTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePromptTemplate,
    onSuccess: (res: boolean) => {
      console.log("Updating prompt template status: ", res);
      queryClient.refetchQueries({ queryKey: ["prompts"] });
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
      queryClient.refetchQueries({ queryKey: ["prompts"] });
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

      queryClient.invalidateQueries({
        queryKey: ["prompt", "stats", promptId],
      });
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

      queryClient.invalidateQueries({
        queryKey: ["prompt", "stats", promptId],
      });
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};

export const usePinPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pinPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "pinned-prompts"] });
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
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};

export const useUpdatePromptResult = () => {
  const handleUpdatePromptResult = ({
    id,
    data,
  }: {
    id: string;
    data: string;
  }) => updatePromptResult(id, data);

  return useMutation({
    mutationFn: handleUpdatePromptResult,
    onSuccess: () => {
      console.log("Update prompt result successfully");
    },
    onError: (e) => {
      console.error(e);
      if (e.message) {
        toast.error(e.message);
      }
    },
  });
};

export const useGeneratePromptResult = () => {
  return useMutation({
    mutationFn: generateResult,
    onSuccess: () => {
      console.log("Succesfully generate prompt result");
    },
    onError: (error: string) => {
      console.error("Error generating prompt result:", error);
    },
  });
};

export const useEvaluatePrompt = (onSuccess: (improvement: string) => void) => {
  return useMutation({
    mutationFn: evaluatePrompt,
    onSuccess: (res) => {
      onSuccess(res);
    },
    onError: (error: string) => {
      console.error("Error evaluating template:", error);
    },
  });
};
