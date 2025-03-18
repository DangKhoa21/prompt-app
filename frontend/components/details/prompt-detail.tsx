"use client";

import { getPrompt } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

interface PromptDetailProps {
  promptId: string;
  className?: string;
}

export default function PromptDetail({
  promptId,
  className,
}: PromptDetailProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: () => getPrompt(promptId),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <div>{data.title}</div>
      <div>{data.description}</div>
      <div>{data.stringTemplate}</div>
      <div>{data.createdAt.toString()}</div>
      <div>{data.updatedAt.toString()}</div>
      <div>{className}</div>
    </>
  );
}
