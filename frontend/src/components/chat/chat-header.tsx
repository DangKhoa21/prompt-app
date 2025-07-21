import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarTrigger2 } from "@/components/ui/sidebar2";
import { BetterTooltip } from "@/components/ui/tooltip";
import { appURL } from "@/config/url.config";
import { useAuth } from "@/context/auth-context";
import { getPrompts } from "@/services/prompt";
import { PromptCard } from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import { User } from "@/services/user/interface";
import { useQueryClient } from "@tanstack/react-query";
import { CircleHelp, Compass, House, PencilRuler, Plus } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useWindowSize } from "usehooks-ts";

export function ChatHeader({
  selectedModelId,
  setRunTutorial,
}: {
  selectedModelId: string;
  setRunTutorial: (val: boolean) => void;
}) {
  const { isAuthenticated } = useAuth();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const queryClient = useQueryClient();
  const triggerMarketplaceRef = useRef<HTMLDivElement>(null);
  const triggerTemplateRef = useRef<HTMLDivElement>(null);

  const tagId = "";
  const search = "";
  const sort: "newest" | "oldest" | "most-starred" | undefined = "newest";
  const filter = { tagId, search, sort };

  const prefetchPrompts = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", filter],
      queryFn: ({ pageParam }) => getPrompts({ pageParam, filter }),
      initialPageParam: "",
      getNextPageParam: (lastPage: Paginated<PromptCard>) =>
        lastPage.nextCursor,
    });
  };

  const prefetchTemplates = () => {
    const user: User | undefined = queryClient.getQueryData([
      "user",
      "profile",
    ]);

    if (!user) return;

    const tab = "";
    const creatorId = user.id;
    const updatedFilter = { ...filter, creatorId };

    queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", updatedFilter, tab],
      queryFn: ({ pageParam }) =>
        getPrompts({ pageParam, filter: updatedFilter }),
      initialPageParam: "",
      getNextPageParam: (lastPage: Paginated<PromptCard>) =>
        lastPage.nextCursor,
    });
  };

  return (
    <header className="chat-header sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-1 md:gap-2 px-1 md:px-3">
        {/* {!isMobile && ( */}
        {/*   <> */}
        <SidebarTrigger className="h-7" />

        <Separator orientation="vertical" className="h-4" />
        {/*   </> */}
        {/* )} */}

        <BetterTooltip content="New chat">
          <Link href={`/`}>
            <Button variant="ghost" className="h-7 p-2">
              <Plus />
            </Button>
          </Link>
        </BetterTooltip>

        <Separator orientation="vertical" className="h-4" />

        <ModelSelector selectedModelId={selectedModelId} />

        <Separator orientation="vertical" className="h-4" />

        <BetterTooltip content={"Back to home"}>
          <Link href={appURL.base}>
            <Button
              variant="ghost"
              className="h-8 w-8"
              aria-label="Back to home"
            >
              <House />
            </Button>
          </Link>
        </BetterTooltip>

        <Separator orientation="vertical" className="h-4" />

        <BetterTooltip content={"Show tutorial again"}>
          <Button
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setRunTutorial(true)}
            aria-label="Show tutorial again"
          >
            <CircleHelp />
          </Button>
        </BetterTooltip>

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated && (
            <>
              <div ref={triggerTemplateRef} onMouseEnter={prefetchTemplates}>
                <Link href={`/templates`}>
                  <Button variant="ghost" className="h-8 p-2">
                    <PencilRuler />
                    {!isMobile && "Templates"}
                  </Button>
                </Link>
              </div>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          <div ref={triggerMarketplaceRef} onMouseEnter={prefetchPrompts}>
            {/* <div> */}
            <Link href={appURL.marketplace}>
              <Button variant="ghost" className="h-8 p-2">
                <Compass />
                {!isMobile && "Marketplace"}
              </Button>
            </Link>
          </div>
          <Separator orientation="vertical" className="h-4" />
          {!isAuthenticated && (
            <>
              <Link href={`/login`}>
                <Button
                  variant="ghost"
                  className="h-7 p-2 border-slate-500 border"
                >
                  Log in
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}

          {/* {!isMobile && !isAuthenticated && ( */}
          {/*   <Separator orientation="vertical" className="h-4" /> */}
          {/* )} */}

          {/* {!isMobile && <SidebarTrigger2 className="h-7" />} */}

          <SidebarTrigger2 className="h-7" />
        </div>
      </div>
    </header>
  );
}
