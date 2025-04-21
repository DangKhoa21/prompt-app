"use client";

import PromptHeadDetail from "@/components/details/prompt-detail-comps/prompt-head-detail";
import PromptResults from "@/components/details/prompt-detail-comps/prompt-results";
import { cn } from "@/lib/utils";
import { Prompt, TemplateTag } from "@/services/prompt/interface";
import { motion } from "framer-motion";

interface PromptDetailProps {
  promptData: Prompt;
  tagsData: TemplateTag[];
  className?: string;
}

export default function PromptDetail({
  promptData,
  tagsData,
  className,
}: PromptDetailProps) {
  return (
    <>
      <motion.div
        key="user-detail"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.3 }}
        className={cn("md:border-2 md:rounded-lg md:p-4 space-y-4", className)}
      >
        <PromptHeadDetail
          promptData={promptData}
          tagsData={tagsData}
        ></PromptHeadDetail>
        <div className="text-base m-1 md:m-2 lg:m-4">
          {promptData.description}
        </div>
        <PromptResults></PromptResults>
      </motion.div>
    </>
  );
}
