import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { createComment, deleteAComment, getComments } from "@/services/comment";
import { CommentItem } from "@/services/comment/interface";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MessageSquare,
  MoreVertical,
  Reply,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/services/user";

export default function Comment({
  comment,
  promptId,
}: {
  comment: CommentItem;
  promptId: string;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showReplyList, setShowReplyList] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState("");

  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", { promptId, parentId: comment.id }],
    queryFn: ({ pageParam }) =>
      getComments({ pageParam, promptId, parentId: comment.id }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const createReplyCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { promptId }],
      });
      setReplyText("");
      setShowReplyForm(false);
      setShowReplyList(true);
    },
    onError: (e) => {
      if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteAComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { promptId }],
      });
    },
    onError: (e) => {
      if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  const handleDeleteComment = (id: string) => {
    const deletePromise = deleteCommentMutation.mutateAsync(id);

    toast.promise(deletePromise, {
      loading: "Deleting comment...",
      success: "Comment deleted successfully!",
    });
  };

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
    <Card key={comment.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={comment.creator.avatarUrl ?? undefined}
                alt={comment.creator.username}
              />
              <AvatarFallback>
                {comment.creator.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-base font-medium">
                {comment.creator.username}
              </CardTitle>
              <CardDescription>
                {" "}
                {formatDate(comment.updatedAt)}
              </CardDescription>
            </div>
          </div>

          {user && comment.creatorId === user.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-7 pt-1 pb-5">
        <p>{comment.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Helpful (0)</span>
          </Button>
          {comment.repliesCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setShowReplyList(!showReplyList);
              }}
            >
              <MessageSquare className="h-3 w-3" />
              <span>Replies ({comment.repliesCount.toString()})</span>
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <Reply className="h-3 w-3" />
          <span>Reply</span>
        </Button>
      </CardFooter>

      {/* Reply Form */}
      {showReplyForm &&
        (isAuthenticated ? (
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
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    createReplyCommentMutation.mutate({
                      promptId,
                      content: replyText,
                      parentId: comment.id,
                    });
                  }}
                  disabled={
                    !replyText.trim() || createReplyCommentMutation.isPending
                  }
                >
                  {createReplyCommentMutation.isPending
                    ? "Replying..."
                    : "Reply"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-4">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You need to be logged in to comment
                </p>
              </div>
              <Button onClick={() => router.push("/login")}>Log In</Button>
            </CardContent>
          </div>
        ))}

      {/* Replies */}
      {showReplyList && (
        <div className="px-6 pb-4 space-y-3">
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((reply) => (
                <Card key={reply.id} className="bg-muted/50 rounded-md">
                  <CardHeader className="p-3">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={reply.creator.avatarUrl ?? undefined}
                            alt={reply.creator.username}
                          />
                          <AvatarFallback>
                            {reply.creator.username.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <CardTitle className="text-sm font-medium">
                            {reply.creator.username}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {" "}
                            {formatDate(reply.updatedAt)}
                          </CardDescription>
                        </div>
                      </div>

                      {user && reply.creatorId === user.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                              onClick={() => handleDeleteComment(reply.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{reply.content}</p>
                  </CardContent>
                </Card>
              ))}
            </Fragment>
          ))}

          {hasNextPage ? (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                {isFetchingNextPage ? "Loading..." : "Load More Comments"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
