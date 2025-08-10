import { getTags } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });
};
