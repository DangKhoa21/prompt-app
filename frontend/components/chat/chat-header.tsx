import { Compass, PencilRuler, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger2 } from "@/components/ui/sidebar2";
import { BetterTooltip } from "@/components/ui/tooltip";
import { ModelSelector } from "@/components/model-selector";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useWindowSize } from "usehooks-ts";
import UserAvatarNavigator from "@/components/navigator/user-avatar-navigator";

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="h-7" />

        <Separator orientation="vertical" className="h-4" />

        <BetterTooltip content="New chat">
          <Button
            variant="ghost"
            className="h-7 p-2"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            <Plus />
          </Button>
        </BetterTooltip>

        <Separator orientation="vertical" className="h-4" />

        <ModelSelector selectedModelId={selectedModelId} />

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                className="h-8 p-2"
                onClick={() => {
                  router.push("/templates");
                  router.refresh();
                }}
              >
                <PencilRuler />
                {!isMobile && "Templates"}
              </Button>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          <Button
            variant="ghost"
            className="h-8 p-2"
            onClick={() => {
              router.push("/marketplace");
              router.refresh();
            }}
          >
            <Compass />
            {!isMobile && "Marketplace"}
          </Button>
          <Separator orientation="vertical" className="h-4" />
          {isAuthenticated === false ? (
            <>
              <Button
                variant="ghost"
                className="h-7 p-2 border-slate-500 border"
                onClick={() => {
                  router.push("/login");
                  router.refresh();
                }}
              >
                Log in
              </Button>
              <Separator orientation="vertical" className="h-4" />
            </>
          ) : (
            <UserAvatarNavigator />
          )}

          <SidebarTrigger2 className="h-7" />
        </div>
      </div>
    </header>
  );
}
