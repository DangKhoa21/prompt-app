import { updateUserProfile } from "@/services/user";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (res: boolean) => {
      console.log("Updating user profile status: ", res);
    },
    onError: (error: string) => {
      console.error("Error user profile:", error);
    },
  });
};
