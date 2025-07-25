"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function DetailsHeader({ pageName }: { pageName: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="h-7" />

        <Separator orientation="vertical" className="h-4" />

        <Button
          variant="ghost"
          className="h-8 p-2"
          onClick={() => {
            router.back();
            router.refresh();
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div>{pageName}</div>

        <div className="flex items-center gap-2 ml-auto">
          {!isAuthenticated && (
            <Link href={`/login`}>
              <Button
                variant="ghost"
                className="h-7 p-2 border-slate-500 border"
              >
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
