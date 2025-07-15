import axiosInstance from "@/lib/axios/axiosIntance";

export async function sendFeedback({
  email,
  message,
}: {
  email: string;
  message: string;
}): Promise<{ id: string }> {
  const response = await axiosInstance.post("/feedback", {
    email,
    message,
  });
  // Return a message id
  return response.data;
}
