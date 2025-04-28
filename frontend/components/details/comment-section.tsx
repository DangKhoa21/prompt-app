"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, Star } from "lucide-react";
import { useState } from "react";
import Comment from "./comment";

const reviews = [
  {
    id: "r1",
    user: {
      name: "Alex Chen",
      username: "alexc",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment:
      "This prompt is incredibly versatile! I've used it for short stories, character sketches, and even to outline a novel. The way it guides the creative process without being too restrictive is perfect.",
    date: new Date(),
    helpful: 42,
    notHelpful: 3,
    replies: [
      {
        id: "reply1",
        user: {
          name: "Emma Johnson",
          username: "emmawrites",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        comment:
          "Thank you for the kind feedback, Alex! I'm glad it's helping with your writing projects.",
        date: new Date(),
      },
    ],
  },
  {
    id: "r2",
    user: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    comment:
      "Great prompt overall! I especially love how it helps develop character motivations. The only reason I'm giving 4 stars instead of 5 is that I wish it had more guidance for genre-specific writing.",
    date: new Date(),
    helpful: 28,
    notHelpful: 2,
  },
  {
    id: "r3",
    user: {
      name: "Michael Rodriguez",
      username: "michaelr",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment:
      "This prompt helped me break through a serious case of writer's block. The structure it provides while still leaving room for creativity is perfect. Highly recommended!",
    date: new Date(),
    helpful: 35,
    notHelpful: 1,
  },
];

export default function CommentSection({ className }: { className: string }) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = () => {
    if (!userRating) return;

    setIsSubmittingReview(true);

    // In a real app, you would send this to your API
    setTimeout(() => {
      // Simulate adding the review to the list
      const newReview = {
        id: `r${Date.now()}`,
        user: {
          name: "Current User",
          username: "currentuser",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        rating: userRating,
        comment: userComment,
        date: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0,
      };
      console.log(newReview);

      // Reset form
      setUserRating(null);
      setUserComment("");
      setIsSubmittingReview(false);

      // Show success message or update UI
      alert("Review submitted successfully!");
    }, 1000);
  };

  return (
    <>
      <div className={cn("mt-12", className)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Reviews & Feedback</h2>
          <div className="text-sm text-muted-foreground">
            {reviews ? reviews.length : 0} reviews
          </div>
        </div>

        {/* Write a Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your experience with this prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <RadioGroup
                className="flex space-x-2"
                value={userRating?.toString() || ""}
                onValueChange={(value) => setUserRating(Number.parseInt(value))}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div
                    key={rating}
                    className="flex flex-col items-center space-y-1"
                  >
                    <RadioGroupItem
                      value={rating.toString()}
                      id={`rating-${rating}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className={`cursor-pointer rounded-full p-1 hover:bg-muted ${
                        userRating === rating
                          ? "text-amber-500"
                          : "text-gray-300"
                      }`}
                    >
                      <Star
                        className={`h-8 w-8 ${userRating && userRating >= rating ? "fill-amber-500" : ""}`}
                      />
                    </Label>
                    <span className="text-xs">{rating}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about this prompt..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmitReview}
              disabled={!userRating || isSubmittingReview}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <Comment key={`comment-${review.id}`} {...review} />
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No reviews yet</AlertTitle>
              <AlertDescription>
                Be the first to review this prompt and help others decide if
                it&apos;s right for them.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
