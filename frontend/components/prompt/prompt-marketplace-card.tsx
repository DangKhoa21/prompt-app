import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface MarketplaceCardProps {
  id: string;
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

export function PromptMarketplaceCard({
  id,
  title,
  description,
  creator,
  category,
  stars,
}: MarketplaceCardProps) {
  const rating = formatRating(stars.length);
  return (
    <Link href={`/?promptId=${id}`}>
      <Card className="group transition-all duration-0 ease-in-out bg-card hover:shadow-md hover:bg-card-foreground hover:duration-300 rounded-3xl">
        <CardHeader className="space-y-1 px-6 pt-4 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-foreground">{title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary" />
              {rating}
            </Badge>
          </div>
          <CardDescription>{category}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-1 line-clamp-2">
          <p className="text-sm text-foreground">{description}</p>
        </CardContent>
        <Separator
          orientation="horizontal"
          className="w-auto mx-6 my-1 bg-neutral-800"
        />
        <CardFooter className="justify-between px-6 pt-1 pb-4 items-center">
          <p className="t-2 text-xs text-foreground-accent group-hover:text-foreground">
            by {creator["username"]}
          </p>
          <p className="t-2 text-xs text-foreground">Try it now</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
