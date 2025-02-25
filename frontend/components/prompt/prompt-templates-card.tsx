import ConfirmDialog from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { useDeletePromptTemplate } from "@/features/template";
import { TemplateTag } from "@/services/prompt/interface";
import { X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  tags: TemplateTag[];
}

const useDeletePromptTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromptTemplate,
    onSuccess: (deletedId) => {
      console.log(deletedId);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error: string) => {
      console.error("Error creating template:", error);
    },
  });
};

export default function PromptTemplateCard({
  id,
  title,
  description,
  tags,
}: TemplateCardProps) {
  const { mutateAsync } = useDeletePromptTemplate();
  const handleDeleteTemplate = () => {
    const deletePromptTemplate = mutateAsync(id);

    toast.promise(deletePromptTemplate, {
      loading: "Deleting prompt template...",
      success: "Deleting prompt template successfully",
      error: (e) => {
        console.error(e);
        return "Failed to delete prompt template";
      },
    });
  };

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
          <div className="flex items-center">
            <ConfirmDialog
              description=""
              variant="ghost"
              type="icon"
              className="text-destructive hover:text-destructive"
              action={handleDeleteTemplate}
            >
              <X className="h-4 w-4" />
            </ConfirmDialog>
          </div>
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
