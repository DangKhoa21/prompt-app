import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function usePromptParams() {
  const searchParams = useSearchParams();

  const [promptId, setPromptId] = useState("");
  const [optionId, setOptionId] = useState("");

  useEffect(() => {
    const id = searchParams.get("promptId") ?? "";
    const opt = searchParams.get("optionId") ?? "";

    setPromptId(id);
    setOptionId(opt);
  }, [searchParams]);

  return {
    promptId,
    optionId,
  };
}
