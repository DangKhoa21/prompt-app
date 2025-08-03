import { getUserProfile } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (isEnable: boolean = true) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    enabled: isEnable,
  });
};
