"use client";

import { LoadingSpinner } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUnpinPrompt } from "@/features/template";
import { getPinnedPrompts } from "@/services/prompt-pin";
import { PromptPinItem } from "@/services/prompt-pin/interface";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, PencilRuler, PinOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function NavPrompts({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: pinnedPrompts,
    isPending,
    isError,
  } = useQuery<Array<PromptPinItem>>({
    queryKey: ["users", "pinned-prompts"],
    queryFn: getPinnedPrompts,
    enabled: isAuthenticated,
  });

  const handlePromptChange = (promptId: string) => {
    if (pathname === "/" || pathname.includes("/chat")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("promptId", promptId);
      window.history.replaceState(null, "", `?${params.toString()}`);
    } else {
      router.push(`/?promptId=${promptId}`);
    }
  };

  const unpinPromptMutation = useUnpinPrompt();

  if (!isAuthenticated || isError) return null;

  if (isPending) {
    return (
      <div className="flex justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Pinned Prompts</SidebarGroupLabel>
      <SidebarMenu>
        {pinnedPrompts.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              className="h-12"
              onClick={() => handlePromptChange(item.id)}
            >
              <PencilRuler className="mr-2 h-4 w-4" />
              <div>
                <div className="line-clamp-1">{item.title}</div>
                <div className="text-xs line-clamp-1">{item.description}</div>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="w-7 peer-data-[size=default]/menu-button:top-3"
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onSelect={() => unpinPromptMutation.mutate(item.id)}
                >
                  <PinOff className="text-muted-foreground" />
                  <span>Unpin</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
