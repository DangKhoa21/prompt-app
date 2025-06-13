import {
  deleteAvatar,
  updateUserPassword,
  updateUserProfile,
  uploadAvatar,
} from "@/services/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Error user profile:", error);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Error uploading avatar:", error);
    },
  });
};

export const useDeleteAvatr = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Error deleting avatar:", error);
    },
  });
};

export const useUpdateUserPassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      updateUserPassword(data),
    onError: (error) => {
      console.error("Error updating user password:", error);
    },
  });
};
