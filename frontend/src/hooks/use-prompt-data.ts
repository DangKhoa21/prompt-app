import { getPrompt } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

export const usePromptData = (promptId: string) => {
  return useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => getPrompt(promptId),
  });
};
