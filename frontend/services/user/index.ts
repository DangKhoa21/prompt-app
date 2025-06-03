import axiosWithAuth from "@/lib/axios/axiosWithAuth";
import { User } from "./interface";

export async function getUser(userId: string): Promise<User> {
  const response = await axiosWithAuth.get(`/users/${userId}`);
  return response.data.data;
}

export async function getUserProfile(): Promise<User> {
  const response = await axiosWithAuth.get(`/users/profile`);
  return response.data.data;
}

export async function updateUserProfile({
  id,
  data,
}: {
  id: string;
  data: Partial<Pick<User, "username" | "bio">>;
}): Promise<boolean> {
  const response = await axiosWithAuth.patch(`/users/${id}`, data);
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

  const response = await axiosWithAuth.post(`/users/${id}/avatar`, formData, {
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
  const response = await axiosWithAuth.delete(`/users/${id}/avatar`, {
    data: { previousUrl },
  });
  return response.data.data;
}
