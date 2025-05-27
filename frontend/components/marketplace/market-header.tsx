"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { PencilRuler, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

export function MarketHeader() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background">
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

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated && (
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
          )}
          {!isAuthenticated && (
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
          )}
        </div>
      </div>
    </header>
  );
}
