import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
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

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  rating: string;
  author: string;
  category: string;
}

export function PromptTemplateCard({
  id,
  title,
  description,
  rating,
  author,
  category,
}: TemplateCardProps) {
  return (
    <Link href={`/?promptId=${id}`}>
      <Card className="transition-all duration-0 ease-in-out bg-gradient-to-tr from-gradient-src-300 via-gradient-mid to-gradient-des-400 hover:shadow-md hover:bg-gradient-to-tr hover:from-gradient-des-300 hover:via-gradient-mid hover:to-gradient-src-400 hover:duration-300 rounded-3xl">
        <CardHeader className="space-y-1 px-6 pt-4 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-primary">{title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary" />
              {rating}
            </Badge>
          </div>
          <CardDescription>{category}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-1">
          <p className="text-sm text-secondary">{description}</p>
        </CardContent>
        <Separator
          orientation="horizontal"
          className="w-auto mx-6 my-1 bg-neutral-800"
        />
        <CardFooter className="justify-between px-6 pt-1 pb-4 items-center">
          <p className="t-2 text-xs text-tertiary">by {author}</p>
          <p className="t-2 text-xs text-tertiary">Try it now</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
