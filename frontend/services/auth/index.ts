import axiosWithAuth from "@/lib/axios/axiosWithAuth";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const response = await axiosWithAuth.post(`/auth/login`, { email, password });
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
  const response = await axiosWithAuth.post(`/auth/register`, {
    email,
    username,
    password,
  });
  return response.data.data;
};

export const forgotPassword = async ({
  email,
}: {
  email: string;
}): Promise<boolean> => {
  const response = await axiosWithAuth.post(`/auth/forgot-password`, { email });
  return response.data.data;
};

export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<boolean> => {
  const response = await axiosWithAuth.post(`/auth/reset-password`, {
    token,
    newPassword,
  });
  return response.data.data;
};
