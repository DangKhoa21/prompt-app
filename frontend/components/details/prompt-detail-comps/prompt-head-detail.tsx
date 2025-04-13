import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Prompt, TemplateTag } from "@/services/prompt/interface";
import Image from "next/image";

interface PromptHeadDetailProps {
  promptData: Prompt;
  tagsData: TemplateTag[];
}

export default function PromptHeadDetail({
  promptData,
  tagsData,
}: PromptHeadDetailProps) {
  const commonBackProps = {
    src: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
    alt: "Background image",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  };

  return (
    <>
      <div className="flex flex-row relative gap-2 p-2 md:p-4">
        <Image
          src={commonBackProps.src}
          alt={commonBackProps.alt}
          fill
          sizes={commonBackProps.sizes}
          className="absolute inset-0 rounded-xl shadow-xl z-0 opacity-40 object-cover"
        ></Image>
        <div className="flex relative w-[160px] h-[96px] md:w-[240px] md:h-[144px] z-10 mt-4 mx-4 mb-2">
          <Image
            src={`https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80`}
            alt="Photo by Drew Beamer"
            fill
            sizes={commonBackProps.sizes}
            className="rounded-lg object-cover"
          ></Image>
        </div>
        <div className="space-y-4 z-10 m-2">
          <div className="text-2xl font-semibold">{promptData.title}</div>
          <div className="flex gap-2 flex-wrap">
            {tagsData.length
              ? tagsData.map((tag, i) => (
                  <Badge key={`tags-${i}`} className="line-clamp-1">
                    {tag.name}
                  </Badge>
                ))
              : "No tags"}
          </div>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <div className="italic">
              Created at {formatDate(promptData.createdAt)}
            </div>
            <div className="italic">
              Updated at {formatDate(promptData.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
