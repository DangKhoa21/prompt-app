import { Badge } from "@/components/ui/badge";
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
    <div className="bg-card">
      <div className="flex flex-col mb-2 bg-slate-50 rounded-lg p-4 border border-slate-500 max-h-[140px] justify-between">
        <div className="flex flex-row justify-between w-full">
          <Link
            href={"/templates/" + id}
            className="text-base font-bold my-auto"
          >
            {title}
          </Link>
        </div>
        <Link href={"/templates/" + id}>
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
        </Link>
      </div>
    </div>
  );
}
