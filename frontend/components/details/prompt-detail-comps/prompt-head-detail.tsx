import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Prompt, TemplateTag } from "@/services/prompt/interface";
import { User } from "@/services/user/interface";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface PromptHeadDetailProps {
  promptData: Prompt;
  userData: User;
  tagsData: TemplateTag[];
}

export default function PromptHeadDetail({
  promptData,
  userData,
  tagsData,
}: PromptHeadDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  // const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // const handleSave = () => {
  //   setIsSaved(!isSaved);
  // };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: promptData?.title,
        text: promptData?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-sm p-6 bg-background">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{promptData.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleLike}>
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            {/* <Button variant="outline" size="icon" onClick={handleSave}> */}
            {/*   <BookmarkPlus */}
            {/*     className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} */}
            {/*   /> */}
            {/* </Button> */}
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
              <AvatarFallback>{"Test"}</AvatarFallback>
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
