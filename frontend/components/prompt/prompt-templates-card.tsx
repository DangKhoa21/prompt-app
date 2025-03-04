import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TemplateTag } from "@/services/prompt/interface";
import Link from "next/link";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  tags: TemplateTag[];
}

export default function PromptTemplateCard({
  id,
  title,
  description,
  tags,
}: TemplateCardProps) {
  return (
    <Card className="max-h[140px]">
        <Link href={"/templates/" + id}>
      <CardHeader className="flex flex-row justify-between w-full">
          {title}
      </CardHeader>
      <CardContent>
          <div className="text-sm text-muted-foreground items-center mb-2 line-clamp-2">
            {description}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
      </CardContent>
        </Link>
    </Card>
  );
}
