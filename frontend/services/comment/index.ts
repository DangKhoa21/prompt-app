import axiosWithAuth from "@/lib/axios/axiosWithAuth";
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
  const response = await axiosWithAuth.post(`/prompts/${promptId}/comments`, {
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
  const response = await axiosWithAuth.get(`/prompts/${promptId}/comments`, {
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
  const response = await axiosWithAuth.patch(`/comments/${commentId}`, {
    content,
  });
  return response.data.data;
}

export async function deleteAComment(commentId: string): Promise<boolean> {
  const response = await axiosWithAuth.delete(`/comments/${commentId}`);
  return response.data.data;
}
