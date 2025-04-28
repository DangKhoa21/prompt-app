"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Star, Zap } from "lucide-react";

interface PromptOverviewProps {
  promptData: Prompt;
}

export default function PromptOverview({ promptData }: PromptOverviewProps) {
  return (
    <motion.div
      key="prompt-overview"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Prompt Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Usage Count</span>
            </div>
            <span className="font-medium">
              {promptData.usageCount.toString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-red-500" />
              <span>Stars</span>
            </div>
            <span className="font-medium">...</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span>Comments</span>
            </div>
            <span className="font-medium">...</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Created</span>
            </div>
            <span className="font-medium">
              {formatDate(promptData.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
