import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { Reply, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface CommentProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  notHelpful: number;
  replies?: CommentReply[];
}

interface CommentReply {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  comment: string;
  date: Date;
}

export default function Comment(comment: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleHelpfulVote = (reviewId: string, isHelpful: boolean) => {
    console.log(reviewId);
    // In a real app, you would update the vote count in your database
    alert(`Marked review as ${isHelpful ? "helpful" : "not helpful"}`);
  };

  const handleReplySubmit = (reviewId: string) => {
    console.log(reviewId);
    // In a real app, you would send this to your API
    setTimeout(() => {
      setShowReplyForm(null);
      setReplyText("");
      alert("Reply submitted successfully!");
    }, 500);
  };

  return (
    <>
      <Card key={comment.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{comment.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  @{comment.user.username}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < comment.rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{comment.comment}</p>
          <div className="text-xs text-muted-foreground">
            {formatDate(comment.date)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => handleHelpfulVote(comment.id, true)}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Helpful ({comment.helpful})</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => handleHelpfulVote(comment.id, false)}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Not Helpful ({comment.notHelpful})</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={() =>
              setShowReplyForm(showReplyForm === comment.id ? null : comment.id)
            }
          >
            <Reply className="h-3 w-3" />
            <span>Reply</span>
          </Button>
        </CardFooter>

        {/* Reply Form */}
        {showReplyForm === comment.id && (
          <div className="px-6 pb-4">
            <div className="bg-muted/50 p-3 rounded-md space-y-3">
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyForm(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="px-6 pb-4 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={reply.user.avatar || "/placeholder.svg"}
                      alt={reply.user.name}
                    />
                    <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{reply.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(reply.date)}
                    </div>
                  </div>
                </div>
                <p className="text-sm">{reply.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
