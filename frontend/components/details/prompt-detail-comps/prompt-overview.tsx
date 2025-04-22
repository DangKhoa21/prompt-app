"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import { motion } from "framer-motion";
import {
  BookmarkPlus,
  Clock,
  Heart,
  MessageSquare,
  Star,
  Zap,
} from "lucide-react";

interface PromptOverviewProps {
  promptData: Prompt;
}

export default function PromptOverview({ promptData }: PromptOverviewProps) {
  return (
    <>
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
              {/* <span className="font-medium">{promptData.usageCount.toLocaleString()}</span> */}
              <span className="font-medium">100</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Rating</span>
              </div>
              <div className="flex items-center">
                {/* <span className="font-medium mr-1">{promptData.rating}</span> */}
                <span className="font-medium mr-1">15</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      // className={`h-3 w-3 ${i < Math.floor(promptData.rating) ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                      className={`h-3 w-3 ${i < Math.floor(3.5) ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Likes</span>
              </div>
              {/* <span className="font-medium">{promptData.likes.toLocaleString()}</span> */}
              <span className="font-medium">65</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Comments</span>
              </div>
              {/* <span className="font-medium">{promptData.comments.toLocaleString()}</span> */}
              <span className="font-medium">35</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="h-4 w-4 text-green-500" />
                <span>Saves</span>
              </div>
              {/* <span className="font-medium">{promptData.saves.toLocaleString()}</span> */}
              <span className="font-medium">40</span>
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
    </>
  );
}
