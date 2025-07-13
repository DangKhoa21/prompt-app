import axiosWithAuth from "@/lib/axios/axiosWithAuth";
import { ShareOption } from "./interface";

export async function createShareOption({
  optionId,
  option,
}: {
  optionId: string;
  option: string;
}): Promise<string> {
  const response = await axiosWithAuth.post(`/option/`, {
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
  const response = await axiosWithAuth.get(`/option/${optionId}`);

  return response.data;
}
