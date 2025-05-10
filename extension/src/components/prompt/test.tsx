"use client";

import { LoadingSpinner } from "@/components/icons";
import { ArrayConfig } from "@/components/prompt/generator-items/array-config";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
//import { PromptSearch } from "@/components/prompt/prompt-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
//import { usePrompt } from "@/context/prompt-context";
//import { usePinPrompt } from "@/features/template";
// import axios from "@/lib/axios";
//import { generateUUID, serializeConfigData } from "@/lib/utils";
import { getPromptWithConfigs } from "@/services/prompt";
//import { createShareOption } from "@/services/share-option";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  FileQuestion,
  Pin,
  RotateCcw,
  Share2,
} from "lucide-react";
//import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
//import { toast } from "sonner";

export function Test() {
  //const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {}
  );
  const [arrayValues, setArrayValues] = useState<
    Record<string, { id: string; values: string[] }[]>
  >({});

  //const searchParams = useSearchParams();
  //const promptId = searchParams.get("promptId");
  const promptId = "01946512-d39f-7c1f-b983-c6c1b3a9a3d7"; // TODO: remove this line and uncomment the above line

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      const data = await response.json();
      return data;
    },
  });

  if (isPending) {
    return (
      <div className="flex h-full justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 justify-center text-center items-center mt-4">
        <p className="text-sm">Please try again! {error.message}</p>
        <Button variant="ghost" className="h-8" onClick={() => refetch()}>
          <RotateCcw />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">hello {data?.title}</div>
    </>
  );
}
