import { Settings, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export default function PromptTemplateCard({
  id,
  name,
  description,
  tags,
}: TemplateCardProps) {
  return (
    <div key={id} className="bg-slate-50 rounded-lg p-4">
      <Link href={"/templates/" + id}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
