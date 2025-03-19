import { cn } from "@/lib/utils";

interface UserDetailProps {
  userId: string;
  className?: string;
}
export default function UserDetail({ userId, className }: UserDetailProps) {
  return (
    <>
      <div className={cn("md:border-2 md:rounded-lg md:p-4", className)}>
        {userId}
      </div>
    </>
  );
}
