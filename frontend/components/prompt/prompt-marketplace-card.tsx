import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Link from "next/link";

export interface MarketplaceCardProps {
  id: string;
  variant?: "default" | "hover";
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
  };
  category: string;
  stars: [
    userId: string,
    promptId: string,
    user: {
      id: string;
      username: string;
    },
  ];
}

const formatRating = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

// TODO: Adjust hover card offset to fit the screen
export function PromptMarketplaceCard({
  id,
  variant,
  title,
  description,
  creator,
  category,
  stars,
}: MarketplaceCardProps) {
  const rating = formatRating(stars.length);

  if (variant === "hover") {
    return (
      <div className="bg-card hover:shadow-md rounded-3xl">
        <Link href={`/?promptId=${id}`}>
          <div className="space-y-1 px-4 pt-2 pb-1">
            <div className="flex flex-row-reverse items-center justify-between">
              <div className="opacity-50 hover:opacity-100">
                <Badge
                  variant="secondary"
                  className="flex border-2 items-center gap-1"
                >
                  <Star className="h-3 w-3 fill-primary" />
                  {rating}
                </Badge>
              </div>
            </div>
            <div>{category}</div>
          </div>
          <div className="mt-[-1.75rem] px-4 pb-1">
            <div>
              <div className="flex items-center text-xl font-semibold leading-none tracking-tigh text-foreground my-6 min-h-[3.75rem]">
                <div className="w-full text-center">{title}</div>
              </div>
              <div className="my-2 mx-1 text-sm text-foreground">
                {description}
              </div>
            </div>
          </div>
          <Separator
            orientation="horizontal"
            className="w-auto mx-4 my-1 bg-neutral-800"
          />
          <div className="flex flex-row justify-between px-4 pt-1 pb-4 items-center">
            <div className="flex flex-row gap-2 t-2 items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-xs text-foreground-accent">
                by {creator["username"]}
              </div>
            </div>
            <div className="t-2 text-xs text-foreground">Try it now</div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <Card className="bg-card hover:shadow-md rounded-3xl">
      <Link href={`/?promptId=${id}`}>
        <CardHeader className="space-y-1 px-4 pt-2 pb-1">
          <div className="flex flex-row-reverse items-center justify-between">
            <CardTitle className="opacity-50 hover:opacity-100">
              <Badge
                variant="secondary"
                className="flex border-2 items-center gap-1"
              >
                <Star className="h-3 w-3 fill-primary" />
                {rating}
              </Badge>
            </CardTitle>
          </div>
          <CardDescription>{category}</CardDescription>
        </CardHeader>
        <CardContent className="mt-[-1.75rem] px-4 pb-1">
          <div>
            <div className="flex items-center text-xl font-semibold leading-none tracking-tigh text-foreground my-6 min-h-[2.5rem]">
              <div className="w-full text-center">{title}</div>
            </div>
            <div className="my-2 mx-1 text-sm text-foreground line-clamp-2">
              {description}
            </div>
          </div>
        </CardContent>
        <Separator
          orientation="horizontal"
          className="w-auto mx-4 my-1 bg-neutral-800"
        />
        <CardFooter className="justify-between px-4 pt-1 pb-4 items-center">
          <div className="flex flex-row gap-2 t-2 items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-xs text-foreground-accent">
              by {creator["username"]}
            </div>
          </div>
          <div className="t-2 text-xs text-foreground">Try it now</div>
        </CardFooter>
      </Link>
    </Card>
  );
}
