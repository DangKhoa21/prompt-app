import axiosInstance from "@/lib/axios";
import { User } from "./interface";

export async function getUserProfile(): Promise<User> {
  const response = await axiosInstance.get(`/users/profile`);
  return response.data.data;
}
