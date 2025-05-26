import axiosInstance from "@/lib/axios";
import { ShareOption } from "./interface";

export async function createShareOption({
  optionId,
  option,
}: {
  optionId: string;
  option: string;
}): Promise<string> {
  const response = await axiosInstance.post(`/option/`, {
    optionId,
    option,
  });

  return response.data.data;
}

export async function getComments({
  optionId,
}: {
  optionId: string;
}): Promise<ShareOption> {
  const response = await axiosInstance.get(`/option/${optionId}`);

  return response.data;
}
