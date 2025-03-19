import PromptCarousels from "@/components/details/prompt-carousels";
// import PromptDetail from "@/components/details/prompt-detail";
// import UserDetail from "@/components/details/user-detail";
import { LoadingSpinner } from "@/components/icons";
import { getIdFromDetailURL } from "@/lib/utils";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promptId = getIdFromDetailURL(slug);

  return (
    <div className="flex-1 bg-background">
      {/* <PromptDetailHeader /> */}

      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <PromptCarousels promptId={promptId} />
        </Suspense>
      </div>
    </div>
  );
}
