import UserDetail from "@/components/details/user-detail";
import { LoadingSpinner } from "@/components/icons";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/tags-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getPromptsServer } from "@/services/prompt/action";
import { getUserServer } from "@/services/user/action";
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

export default async function Page({ params, searchParams }: ProfilePageProps) {
  const { id } = params;

  const { tagId, search, sort } = searchParams || {
    tagId: "",
    search: "",
    sort: "newest",
  };
  const userDataId = id;
  const filter = { tagId, search, userDataId, sort };

  const initialPrompt = await getPromptsServer({
    pageParam: "",
    filter: filter,
  });

  const userData = await getUserServer(id);

  return (
    <>
      <div className="max-w-screen-xl self-center items-center">
        <div className="min-h-screen">
          {/* Cover Image */}
          <div
            className="h-64 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80)`,
            }}
          ></div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Profile Header */}
            <div className="relative bg-background rounded-lg shadow-sm -mt-20 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage
                    src={"/placeholder.svg"}
                    alt={userData.username}
                  />
                  <AvatarFallback>{userData.username.charAt(0)}</AvatarFallback>
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

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{userData.bio}</p>

                    {/* {userData.location && ( */}
                    {/*   <div className="flex items-center gap-2"> */}
                    {/*     <Globe className="h-4 w-4 text-muted-foreground" /> */}
                    {/*     <span>{userData.location}</span> */}
                    {/*   </div> */}
                    {/* )} */}

                    {/* {userData.website && ( */}
                    {/*   <div className="flex items-center gap-2"> */}
                    {/*     <Globe className="h-4 w-4 text-muted-foreground" /> */}
                    {/*     <a */}
                    {/*       href={userData.website} */}
                    {/*       target="_blank" */}
                    {/*       rel="noopener noreferrer" */}
                    {/*       className="text-primary hover:underline" */}
                    {/*     > */}
                    {/*       {userData.website.replace(/^https?:\/\//, "")} */}
                    {/*     </a> */}
                    {/*   </div> */}
                    {/* )} */}

                    {/* <div className="flex gap-3"> */}
                    {/*   {userData.socialLinks.twitter && ( */}
                    {/*     <Button variant="outline" size="icon" asChild> */}
                    {/*       <a */}
                    {/*         href={`https://twitter.com/${userData.socialLinks.twitter}`} */}
                    {/*         target="_blank" */}
                    {/*         rel="noopener noreferrer" */}
                    {/*         aria-label="Twitter" */}
                    {/*       > */}
                    {/*         <Twitter className="h-4 w-4" /> */}
                    {/*       </a> */}
                    {/*     </Button> */}
                    {/*   )} */}
                    {/*   {userData.socialLinks.github && ( */}
                    {/*     <Button variant="outline" size="icon" asChild> */}
                    {/*       <a */}
                    {/*         href={`https://github.com/${userData.socialLinks.github}`} */}
                    {/*         target="_blank" */}
                    {/*         rel="noopener noreferrer" */}
                    {/*         aria-label="GitHub" */}
                    {/*       > */}
                    {/*         <Github className="h-4 w-4" /> */}
                    {/*       </a> */}
                    {/*     </Button> */}
                    {/*   )} */}
                    {/*   {userData.socialLinks.linkedin && ( */}
                    {/*     <Button variant="outline" size="icon" asChild> */}
                    {/*       <a */}
                    {/*         href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} */}
                    {/*         target="_blank" */}
                    {/*         rel="noopener noreferrer" */}
                    {/*         aria-label="LinkedIn" */}
                    {/*       > */}
                    {/*         <Linkedin className="h-4 w-4" /> */}
                    {/*       </a> */}
                    {/*     </Button> */}
                    {/*   )} */}
                    {/* </div> */}
                  </CardContent>
                </Card>

                {/* Expertise */}
                {/* <Card> */}
                {/*   <CardHeader> */}
                {/*     <CardTitle>Expertise</CardTitle> */}
                {/*   </CardHeader> */}
                {/*   <CardContent> */}
                {/*     <div className="flex flex-wrap gap-2"> */}
                {/*       {userData.expertise.map((skill) => ( */}
                {/*         <Badge key={skill} variant="secondary"> */}
                {/*           {skill} */}
                {/*         </Badge> */}
                {/*       ))} */}
                {/*     </div> */}
                {/*   </CardContent> */}
                {/* </Card> */}

                {/* Achievements */}
                {/* <Card> */}
                {/*   <CardHeader> */}
                {/*     <CardTitle>Achievements</CardTitle> */}
                {/*   </CardHeader> */}
                {/*   <CardContent className="space-y-4"> */}
                {/*     {userData.achievements.map((achievement) => ( */}
                {/*       <div */}
                {/*         key={achievement.id} */}
                {/*         className="flex items-start gap-3" */}
                {/*       > */}
                {/*         <div className="bg-primary/10 p-2 rounded-full"> */}
                {/*           {achievement.icon === "award" && ( */}
                {/*             <Award className="h-5 w-5 text-primary" /> */}
                {/*           )} */}
                {/*           {achievement.icon === "zap" && ( */}
                {/*             <Zap className="h-5 w-5 text-amber-500" /> */}
                {/*           )} */}
                {/*           {achievement.icon === "heart" && ( */}
                {/*             <Heart className="h-5 w-5 text-red-500" /> */}
                {/*           )} */}
                {/*         </div> */}
                {/*         <div> */}
                {/*           <h3 className="font-medium">{achievement.title}</h3> */}
                {/*           <p className="text-sm text-muted-foreground"> */}
                {/*             {achievement.description} */}
                {/*           </p> */}
                {/*           <p className="text-xs text-muted-foreground mt-1"> */}
                {/*             {formatDate(achievement.date)} */}
                {/*           </p> */}
                {/*         </div> */}
                {/*       </div> */}
                {/*     ))} */}
                {/*   </CardContent> */}
                {/* </Card> */}

                {/* Stats */}
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                <div className="max-w-2xl mx-auto mt-4">
                  <MarketSearch showTitle={false} />

                  <Suspense fallback={<LoadingSpinner />}>
                    <TagsList />
                  </Suspense>

                  <PromptsList initialPrompt={initialPrompt} filter={filter} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <UserDetail userData={userData} className="mt-2 mx-8"></UserDetail>
      </div>
    </>
  );
}
