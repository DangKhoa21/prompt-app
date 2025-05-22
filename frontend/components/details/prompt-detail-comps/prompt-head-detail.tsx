import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStarPrompt, useUnstarPrompt } from "@/features/template";
import { cn, formatDate } from "@/lib/utils";
import { Prompt, PromptStats, TemplateTag } from "@/services/prompt/interface";
import { User } from "@/services/user/interface";
import { Share2, Star } from "lucide-react";
import { toast } from "sonner";

interface PromptHeadDetailProps {
  promptData: Prompt & Partial<PromptStats>;
  userData: User;
  tagsData: TemplateTag[];
}

export default function PromptHeadDetail({
  promptData,
  userData,
  tagsData,
}: PromptHeadDetailProps) {
  const starMutation = useStarPrompt({ promptId: promptData.id });
  const unstarMutation = useUnstarPrompt({ promptId: promptData.id });

  const handleStar = () => {
    if (promptData.hasStarred) {
      unstarMutation.mutate(promptData.id);
    } else {
      starMutation.mutate(promptData.id);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard!");
  };

  return (
    <>
      <div className="rounded-lg shadow-sm p-6 bg-background">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{promptData.title}</h1>
          <div className="flex gap-2">
            <Button
              className="group"
              variant="outline"
              size="icon"
              onClick={handleStar}
            >
              <Star
                className={cn("h-4 w-4 group-hover:fill-primary", {
                  "fill-primary": promptData.hasStarred,
                })}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">{promptData.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tagsData.length
            ? tagsData.map((tag, i) => (
                <Badge key={`tags-${i}`} className="line-clamp-1">
                  {tag.name}
                </Badge>
              ))
            : "No tags"}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={"/placeholder.svg"} alt={"User"} />
              <AvatarFallback>{userData.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium">{userData.username}</p>
                {/* {promptData.creator.verified && ( */}
                {/*   <svg */}
                {/*     className="h-4 w-4 text-blue-500" */}
                {/*     fill="currentColor" */}
                {/*     viewBox="0 0 24 24" */}
                {/*   > */}
                {/*     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /> */}
                {/*   </svg> */}
                {/* )} */}

                {/* <svg */}
                {/*   className="h-4 w-4 text-blue-500" */}
                {/*   fill="currentColor" */}
                {/*   viewBox="0 0 24 24" */}
                {/* > */}
                {/*   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /> */}
                {/* </svg> */}
              </div>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground italic">
            <div className="">Updated {formatDate(promptData.updatedAt)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
