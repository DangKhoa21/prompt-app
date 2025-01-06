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

interface TemplateCardProps {
  title: string
  description: string
  rating: string
  author: string
  category: string
}

export function PromptTemplateCard({ title, description, rating, author, category }: TemplateCardProps) {
  return (
    <Card className="transition-all w-[320px] hover:shadow-md bg-sky-200 rounded-3xl">
      <CardHeader className="space-y-1 px-6 pt-4 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary" />
            {rating}
          </Badge>
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-1">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-between px-6 py-1 pb-4 items-center">
        <p className="t-2 text-xs text-muted-foreground">by {author}</p>
        <Button className="w-auto" variant="secondary">
          Try it now
        </Button>
      </CardFooter>
    </Card>
  )
}


