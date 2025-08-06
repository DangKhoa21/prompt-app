"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useDeleteAvatr, useUploadAvatar } from "@/features/settings";
import { User } from "@/services/user/interface";
import { Camera, Loader2, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export function AvatarUpload({ user }: { user: User }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatr();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
      );
      return;
    }

    // max 512kB
    const maxSize = 512 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Avatar image must be less than 512kB.");
      return;
    }

    uploadAvatarMutation.mutate({
      id: user.id,
      file,
    });

    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    deleteAvatarMutation.mutate({
      id: user.id,
      previousUrl: user.avatarUrl as string,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Avatar className="w-24 h-24 border cursor-pointer relative">
              {(uploadAvatarMutation.isPending ||
                deleteAvatarMutation.isPending) && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <AvatarImage
                src={user.avatarUrl ?? undefined}
                alt={user.username}
              />
              <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full z-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={handleAvatarClick}>
            <Camera className="w-4 h-4 mr-2" />
            Upload new avatar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteAvatar}
            disabled={
              deleteAvatarMutation.isPending ||
              user.avatarUrl?.length === 0 ||
              !user.avatarUrl
            }
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove avatar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input */}
      <label htmlFor="avatar-upload" className="hidden">
        Upload Avatar
      </label>
      <input
        id="avatar-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
    </>
  );
}
