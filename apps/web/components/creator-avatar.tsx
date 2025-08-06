import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";

interface CreatorAvatarProps {
  username: string;
  src?: string;
}

export default function CreatorAvatar({
  username,
  src = "https://github.com/shadcn.png",
}: CreatorAvatarProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Avatar className="w-8 h-8">
        <AvatarImage src={src} alt={`Avatar of @${username}`} loading="lazy" />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-xs text-foreground-accent line-clamp-2">
        by {username}
      </div>
    </div>
  );
}
