import { Compass, PencilRuler, Plus } from "lucide-react";

import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarTrigger2 } from "@/components/ui/sidebar2";
import { BetterTooltip } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { getPrompts } from "@/services/prompt";
import { Paginated } from "@/services/shared";
import { PromptCard } from "@/services/prompt/interface";

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const queryClient = useQueryClient();
  const triggerMarketplaceRef = useRef<HTMLDivElement>(null);
  // const triggerTemplateRef = useRef<HTMLDivElement>(null);

  const tagId = "";
  const search = "";
  const sort: "newest" | "oldest" | "most-starred" | undefined = "newest";
  const filter = { tagId, search, sort };

  // const tab = "";
  //
  // const updatedFilter = { ...filter, creatorId };

  const prefetchPrompts = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", filter],
      queryFn: ({ pageParam }) => getPrompts({ pageParam, filter }),
      initialPageParam: "",
      getNextPageParam: (lastPage: Paginated<PromptCard>) =>
        lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
    });
  };

  // const prefetchTemplates = () => {
  //   queryClient.prefetchInfiniteQuery({
  //     queryKey: ["prompts", updatedFilter, tab],
  //     queryFn: () => getPromptTemplate(),
  //     staleTime: 1000 * 60 * 5, // optional: cache for 5 mins
  //   });
  // };

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
          <div ref={triggerMarketplaceRef} onMouseEnter={prefetchPrompts}>
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
          </div>
          <Separator orientation="vertical" className="h-4" />
          {!isAuthenticated && (
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
          )}

          <SidebarTrigger2 className="h-7" />
        </div>
      </div>
    </header>
  );
}
