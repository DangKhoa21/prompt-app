import axiosInstance from "@/lib/axios";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const response = await axiosInstance.post(`/auth/login`, { email, password });
  return response.data.data;
};

export const register = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}): Promise<string> => {
  const response = await axiosInstance.post(`/auth/register`, {
    email,
    username,
    password,
  });
  return response.data.data;
};
