import axiosInstance from "@/lib/axios";
import { Paginated } from "@/services/shared";
import { CommentItem } from "./interface";

export async function createComment({
  promptId,
  content,
  parentId,
}: {
  promptId: string;
  content: string;
  parentId?: string | null;
}): Promise<string> {
  const response = await axiosInstance.post(`/prompts/${promptId}/comments`, {
    content,
    parentId,
  });
  return response.data.data;
}

export async function getComments({
  pageParam,
  promptId,
  parentId,
}: {
  pageParam: string;
  promptId: string;
  parentId?: string;
}): Promise<Paginated<CommentItem>> {
  const response = await axiosInstance.get(`/prompts/${promptId}/comments`, {
    params: {
      limit: 3,
      cursor: pageParam.length > 0 ? pageParam : undefined,
      parentId,
    },
  });
  return response.data;
}

export async function updateAComment(
  commentId: string,
  { content }: { content: string },
): Promise<boolean> {
  const response = await axiosInstance.patch(`/comments/${commentId}`, {
    content,
  });
  return response.data.data;
}

export async function deleteAComment(commentId: string): Promise<boolean> {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data.data;
}
