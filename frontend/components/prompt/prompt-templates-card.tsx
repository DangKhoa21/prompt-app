import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePromptTemplate } from "@/services/prompt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, X } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "../utils/confirm-dialog";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
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
  const {
    mutate: deleteTemplate,
    isPending: isDeleteTemplatePending,
    isError: isDeleteTemplateError,
    error: deleteTemplateError,
  } = useDeletePromptTemplate();

  const handleDeleteTemplate = () => {
    deleteTemplate(id);
    console.log(
      isDeleteTemplatePending,
      isDeleteTemplateError,
      deleteTemplateError
    );
  };

  return (
    <div className="bg-card">
      <div className="flex flex-col mb-2 bg-slate-50 rounded-lg p-4 border border-slate-500 max-h-[140px] justify-between">
        <div className="flex flex-row justify-between w-full">
          <div className="text-base font-bold my-auto">{title}</div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
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
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
}
