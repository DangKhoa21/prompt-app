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
    <Card className="transition-all w-[320px] hover:shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary" />
            {rating}
          </Badge>
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">by {author}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          Try it now
        </Button>
      </CardFooter>
    </Card>
  )
}


