"use client";

import Container from "@/components/container";
import UserAbout from "@/components/details/user-detail-comps/about";
import UserAchievements from "@/components/details/user-detail-comps/achievements";
import UserExpertise from "@/components/details/user-detail-comps/expertise";
import { LoadingSpinner } from "@/components/icons";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/marketplace/tags-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Mail, Zap } from "lucide-react";
import { Suspense } from "react";

interface ProfilePageProps {
  params: { id: string };
  searchParams?: {
    tagId?: string;
    search?: string;
    sort?: "newest" | "oldest" | "most-starred";
  };
}

export default function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = params;

  const { tagId, search, sort } = searchParams || {
    tagId: "",
    search: "",
    sort: "newest",
  };
  const userDataId = id;
  const filter = { tagId, search, userDataId, sort };

  const { data: userData } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    placeholderData: {
      id: "",
      avatarUrl: null,
      bio: null,
      username: "unknown",
      email: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (!userData)
    return (
      <div className="flex h-full items-center justify-center">
        This user is not exist
      </div>
    );

  return (
    <>
      {/* Cover Image */}
      <div
        className="h-64 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80)`,
        }}
      ></div>

      {/* Main Content */}
      <Container>
        <div className="min-h-screen mx-auto px-4 w-11/12 space-y-6 md:space-y-10">
          {/* Profile Header */}
          <div className="relative bg-background rounded-lg shadow-sm -mt-20 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={"/placeholder.svg"} alt={userData.username} />
                <AvatarFallback>{userData.username.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">
                        {userData.username}
                      </h1>
                    </div>
                    <p className="text-muted-foreground">@{userData.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <a href={`mailto:${userData.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>
                        {/* {userData.stats.totalPrompts.toLocaleString()} */}
                        50
                      </strong>{" "}
                      <span className="text-muted-foreground">Prompts</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {formatDate(userData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio, stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* About */}
              <UserAbout userData={userData} />
            </div>

            <div className="space-y-6">
              {/* Expertise */}
              <UserExpertise />

              {/* Achievements */}
              <UserAchievements />

              {/* Stats */}
            </div>
          </div>

          {/* Main Content Area */}
          <MarketSearch showTitle={false} />

          <Suspense fallback={<LoadingSpinner />}>
            <TagsList />
          </Suspense>

          <PromptsList filter={filter} />
        </div>
      </Container>
    </>
  );
}
