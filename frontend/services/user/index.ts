import axiosInstance from "@/lib/axios";
import { User } from "./interface";

export async function getUserProfile(): Promise<User> {
  const response = await axiosInstance.get(`/users/profile`);
  return response.data.data;
}

export async function updateUserProfile({
  id,
  data,
}: {
  id: string;
  data: Partial<Pick<User, "username" | "bio">>;
}): Promise<boolean> {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response.data.data;
}

export async function uploadAvatar({
  id,
  file,
}: {
  id: string;
  file: File;
}): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(`/users/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}

export async function deleteAvatar({
  id,
  previousUrl,
}: {
  id: string;
  previousUrl: string;
}): Promise<boolean> {
  const response = await axiosInstance.delete(`/users/${id}/avatar`, {
    data: { previousUrl },
  });
  return response.data.data;
}
