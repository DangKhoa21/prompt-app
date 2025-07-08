import { useQuery } from "@tanstack/react-query";
import { getPromptWithConfigs } from "@/services/prompt";

export function usePromptData(promptId: string | null) {
  return useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => {
      return getPromptWithConfigs(promptId);
    },
  });
}
