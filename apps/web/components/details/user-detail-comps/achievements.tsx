"use client";

import type React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { getPromptsOfCreator } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Star,
  FileText,
  Award,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  threshold: number;
  type: "prompts" | "stars";
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  unlocked: boolean;
}

export default function UserAchievements({ userId }: { userId: string }) {
  const {
    data: userPrompts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["prompts", "creator", userId],
    queryFn: () => getPromptsOfCreator(userId),
  });

  const promptCount = isPending || isError ? 0 : userPrompts?.length || 0;
  const totalStars =
    isPending || isError
      ? 0
      : userPrompts?.reduce((total, prompt) => total + prompt.starCount, 0) ||
        0;

  const achievements: Achievement[] = [
    // Prompt-based achievements
    {
      id: "first-prompt",
      title: "First Steps",
      description: "Created your first prompt",
      icon: FileText,
      threshold: 1,
      type: "prompts",
      tier: "bronze",
      unlocked: promptCount >= 1,
    },
    {
      id: "prompt-creator",
      title: "Prompt Creator",
      description: "Created 5 prompts",
      icon: Target,
      threshold: 5,
      type: "prompts",
      tier: "bronze",
      unlocked: promptCount >= 5,
    },
    {
      id: "prompt-master",
      title: "Prompt Master",
      description: "Created 10 prompts",
      icon: Award,
      threshold: 10,
      type: "prompts",
      tier: "silver",
      unlocked: promptCount >= 10,
    },
    {
      id: "prompt-expert",
      title: "Prompt Expert",
      description: "Created 25 prompts",
      icon: Trophy,
      threshold: 25,
      type: "prompts",
      tier: "gold",
      unlocked: promptCount >= 25,
    },
    {
      id: "prompt-legend",
      title: "Prompt Legend",
      description: "Created 50 prompts",
      icon: Crown,
      threshold: 50,
      type: "prompts",
      tier: "platinum",
      unlocked: promptCount >= 50,
    },
    {
      id: "prompt-god",
      title: "Prompt God",
      description: "Created 100+ prompts",
      icon: Sparkles,
      threshold: 100,
      type: "prompts",
      tier: "diamond",
      unlocked: promptCount >= 100,
    },
    // Star-based achievements
    {
      id: "rising-star",
      title: "Rising Star",
      description: "Earned 10 stars",
      icon: Star,
      threshold: 10,
      type: "stars",
      tier: "bronze",
      unlocked: totalStars >= 10,
    },
    {
      id: "popular-creator",
      title: "Popular Creator",
      description: "Earned 50 stars",
      icon: TrendingUp,
      threshold: 50,
      type: "stars",
      tier: "silver",
      unlocked: totalStars >= 50,
    },
    {
      id: "star-collector",
      title: "Star Collector",
      description: "Earned 100 stars",
      icon: Zap,
      threshold: 100,
      type: "stars",
      tier: "gold",
      unlocked: totalStars >= 100,
    },
    {
      id: "superstar",
      title: "Superstar",
      description: "Earned 250 stars",
      icon: Award,
      threshold: 250,
      type: "stars",
      tier: "platinum",
      unlocked: totalStars >= 250,
    },
    {
      id: "legendary",
      title: "Legendary",
      description: "Earned 500 stars",
      icon: Crown,
      threshold: 500,
      type: "stars",
      tier: "diamond",
      unlocked: totalStars >= 500,
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const nextPromptAchievement = achievements.find(
    (a) => a.type === "prompts" && !a.unlocked
  );
  const nextStarAchievement = achievements.find(
    (a) => a.type === "stars" && !a.unlocked
  );

  const getTierColor = (tier: Achievement["tier"]) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "diamond":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierGradient = (tier: Achievement["tier"]) => {
    switch (tier) {
      case "bronze":
        return "from-amber-400 to-amber-600";
      case "silver":
        return "from-gray-400 to-gray-600";
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "platinum":
        return "from-purple-400 to-purple-600";
      case "diamond":
        return "from-blue-400 to-blue-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
          <Badge variant="secondary" className="ml-auto">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Unlocked Achievements
            </h4>
            <ScrollArea className="h-[240px]">
              <div className="grid gap-3 pr-4">
                {unlockedAchievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full bg-gradient-to-br ${getTierGradient(
                          achievement.tier
                        )}`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-sm">
                            {achievement.title}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${getTierColor(
                              achievement.tier
                            )}`}
                          >
                            {achievement.tier}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Progress to Next Achievements */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Progress to Next
          </h4>

          {nextPromptAchievement && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {nextPromptAchievement.title}
                </span>
                <span className="text-muted-foreground">
                  {promptCount}/{nextPromptAchievement.threshold}
                </span>
              </div>
              <Progress
                value={(promptCount / nextPromptAchievement.threshold) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {nextPromptAchievement.description}
              </p>
            </div>
          )}

          {nextStarAchievement && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{nextStarAchievement.title}</span>
                <span className="text-muted-foreground">
                  {totalStars}/{nextStarAchievement.threshold}
                </span>
              </div>
              <Progress
                value={(totalStars / nextStarAchievement.threshold) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {nextStarAchievement.description}
              </p>
            </div>
          )}
        </div>

        {/* Locked Achievements Preview */}
        {achievements.filter((a) => !a.unlocked).length > 2 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {achievements.filter((a) => !a.unlocked).length - 2} more
              achievements to unlock
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
