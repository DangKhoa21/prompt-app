"use client";

import { DarkModeSwitch } from "@/components/nav/darkmode-switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { EXTENSION_URL } from "@/config";
import { useAuth } from "@/context/auth-context";
import { Settings } from "@/features/settings";
import { getUserProfile } from "@/services/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Moon,
  Sparkles,
  Blocks,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isMobile } = useSidebar();
  const auth = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    auth.setToken(null);
    queryClient.removeQueries({ queryKey: ["user", "profile"] });
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user && (
                  <AvatarImage
                    alt={user.username}
                    src={user?.avatarUrl || undefined}
                  />
                )}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user ? user.username : "Guest"}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user && (
                    <AvatarImage
                      alt={user.username}
                      src={user?.avatarUrl || undefined}
                    />
                  )}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user ? user.username : "Guest"}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => window.open(EXTENSION_URL, "_blank")}
              >
                <Blocks />
                Extension
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-default"
                onSelect={(e) => e.preventDefault()}
              >
                <Moon />
                Dark Mode
                <DarkModeSwitch />
              </DropdownMenuItem>

              {isAuthenticated && (
                <>
                  <Settings />

                  <DropdownMenuItem disabled>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            {isAuthenticated && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleLogout()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
