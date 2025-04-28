"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useState, Fragment } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createComment, getComments } from "@/services/comment";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { AlertCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Comment from "./comment";
import { LoadingSpinner } from "@/components/icons";

export default function CommentSection({
  promptId,
  className,
}: {
  promptId: string;
  className?: string;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userComment, setUserComment] = useState("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", { promptId }],
    queryFn: ({ pageParam }) =>
      getComments({ pageParam, promptId, parentId: "null" }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", { promptId }] });
      setUserComment("");
    },
    onError: (e) => {
      if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  if (status === "pending") {
    return (
      <div className="flex h-full justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <div className={cn("mt-12", className)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Comments</h2>
          <div className="text-sm text-muted-foreground">... comments</div>
        </div>

        {/* Write a Comment */}
        {isAuthenticated ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Write a Comment</CardTitle>
              <CardDescription>
                Share your experience with this prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment" className="hidden">
                  Your Comment
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Leave your comment here..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={() => {
                  createCommentMutation.mutate({
                    promptId,
                    content: userComment,
                  });
                }}
                disabled={
                  userComment.trim().length === 0 ||
                  createCommentMutation.isPending
                }
              >
                {createCommentMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Join the conversation</CardTitle>
              <CardDescription>
                Log in to share your thoughts on this prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You need to be logged in to comment
                </p>
              </div>
              <Button onClick={() => router.push("/login")}>Log In</Button>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((comment) => (
                <Comment
                  key={`comment-${comment.id}`}
                  comment={comment}
                  promptId={promptId}
                />
              ))}
            </Fragment>
          ))}

          {data.pages[0].data.length > 0 ? null : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No comments yet</AlertTitle>
              <AlertDescription>
                Be the first to comment this prompt and help others decide if
                it&apos;s right for them.
              </AlertDescription>
            </Alert>
          )}

          {!hasNextPage ? null : (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                {isFetchingNextPage ? "Loading..." : "Load More Comments"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
