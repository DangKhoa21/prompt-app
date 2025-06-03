"use client";

import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWindowSize } from "usehooks-ts";
import Link from "next/link";

export function TemplatesHeader() {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="h-7" />

        <div className="flex items-center gap-2 ml-auto">
          <Link href="/marketplace">
            <Button variant="ghost" className="h-8 p-2">
              <Compass />
              {!isMobile && "Marketplace"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
