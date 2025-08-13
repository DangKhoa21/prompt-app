"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { getPromptsOfCreator } from "@/services/prompt";
import type { User } from "@/services/user/interface";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MapPin,
  Twitter,
  Linkedin,
  ExternalLink,
  PencilRuler,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface UserAboutProps {
  userData: User;
}

export default function UserAbout({ userData }: UserAboutProps) {
  const mockLocation = "San Francisco, CA";
  const mockSocialLinks = [
    { platform: "Twitter", url: "https://twitter.com/example", icon: Twitter },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/example",
      icon: Linkedin,
    },
  ];
  const mockSkills = ["JavaScript", "React", "Next.js", "TypeScript"];

  const {
    data: userPrompts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["prompts", "creator", userData.id],
    queryFn: () => getPromptsOfCreator(userData.id),
    enabled: !!userData.id,
  });

  const totalStars =
    isPending || isError
      ? 0
      : userPrompts.reduce((total, prompt) => total + prompt.starCount, 0);

  const promptCount = isPending || isError ? 0 : userPrompts.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          About
          <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio Section */}
        {userData.bio && (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {userData.bio}
            </p>
          </div>
        )}

        {/* Location Section */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{mockLocation}</span>
        </div>

        <Separator />

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <PencilRuler className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Prompts
              </span>
            </div>
            <div className="text-2xl font-bold">
              {isPending ? (
                <div className="h-6 w-8 bg-muted animate-pulse rounded" />
              ) : (
                promptCount
              )}
            </div>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Stars
              </span>
            </div>
            <div className="text-2xl font-bold">
              {isPending ? (
                <div className="h-6 w-8 bg-muted animate-pulse rounded" />
              ) : (
                totalStars
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Social Links Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Connect
          </h4>
          <div className="flex flex-wrap gap-2">
            {mockSocialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-3 w-3" />
                    {link.platform}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Skills Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {mockSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Join Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Joined {formatDate(userData.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
