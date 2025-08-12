import { getTagsForTemplate } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

export const useTemplateTags = (id: string) => {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: () => getTagsForTemplate(id),
  });
};
