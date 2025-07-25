"use client";

import { ChevronLeft, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { appURL } from "@/config/url.config";
import { useDeletePromptTemplate } from "@/features/template";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TemplatesIdHeader({ id }: { id: string }) {
  const router = useRouter();
  const { mutateAsync: mutateDeleteTemplate } = useDeletePromptTemplate();

  const handleDeleteTemplate = () => {
    const deletePromptTemplate = mutateDeleteTemplate(id);

    toast.promise(deletePromptTemplate, {
      loading: "Deleting prompt template...",
      success: () => {
        router.push(appURL.templates);
        router.refresh();
        return "Prompt template deleted successfully";
      },
      error: (e) => {
        console.error(e);
        return "Failed to delete prompt template";
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="h-7" />

        <Separator orientation="vertical" className="h-4" />

        <Button
          variant="ghost"
          className="h-8 p-2"
          onClick={() => {
            router.push(appURL.templates);
            router.refresh();
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div>Template Editor</div>

        <div className="flex items-center gap-2 ml-auto">
          <ConfirmDialog
            description="Your template will be permanently deleted."
            variant="destructive"
            type="icon"
            className="mr-4"
            action={handleDeleteTemplate}
          >
            <Trash2 className="h-8 w-8" />
          </ConfirmDialog>
        </div>
      </div>
    </header>
  );
}
