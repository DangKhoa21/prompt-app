import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator";

interface TemplateCardProps {
  title: string
  description: string
  rating: string
  author: string
  category: string
}

export function PromptTemplateCard({ title, description, rating, author, category }: TemplateCardProps) {
  return (
    <Card className="transition-all bg-card hover:shadow-md hover:bg-card-hover rounded-3xl">
      <CardHeader className="space-y-1 px-6 pt-4 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground-primary">{title}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary" />
            {rating}
          </Badge>
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-1">
        <p className="text-sm text-foreground-secondary">{description}</p>
      </CardContent>
      <Separator orientation="horizontal" className="w-auto mx-6 my-1 bg-slate-800"/>
      <CardFooter className="justify-between px-6 pt-1 pb-4 items-center">
        <p className="t-2 text-xs text-foreground-muted">by {author}</p>
          <p className="t-2 text-xs text-foreground-muted">Try it now</p>
      </CardFooter>
    </Card>
  )
}


