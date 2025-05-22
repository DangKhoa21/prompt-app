"use client";

import PromptHeadDetail from "@/components/details/prompt-detail-comps/prompt-head-detail";
import PromptResults from "@/components/details/prompt-detail-comps/prompt-results";
import { cn } from "@/lib/utils";
import { Prompt, PromptStats, TemplateTag } from "@/services/prompt/interface";
import { User } from "@/services/user/interface";
import { motion } from "framer-motion";
import CommentSection from "./comment-section";

interface PromptDetailProps {
  promptData: Prompt & Partial<PromptStats>;
  userData: User;
  tagsData: TemplateTag[];
  className?: string;
}

export default function PromptDetail({
  promptData,
  userData,
  tagsData,
  className,
}: PromptDetailProps) {
  return (
    <>
      <motion.div
        key="prompt-detail"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.3 }}
        className={cn("", className)}
      >
        <PromptHeadDetail
          promptData={promptData}
          userData={userData}
          tagsData={tagsData}
        />
        <PromptResults promptData={promptData} />
        <CommentSection promptId={promptData.id} />
      </motion.div>
    </>
  );
}
