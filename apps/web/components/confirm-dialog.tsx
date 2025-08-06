import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface ConfirmDialogProps {
  description: string;
  type?: "icon";
  variant: "default" | "secondary" | "outline" | "ghost" | "destructive";
  action: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function ConfirmDialog({
  description,
  type,
  variant,
  action,
  className,
  children,
}: ConfirmDialogProps) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={variant}
            size={type}
            className={cn("h-8", className, type === "icon" ? "w-8" : "border")}
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure? This action can&apos;t be undone!
            </AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={action}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
