import PromptCarousel from "@/components/details/prompt-carousel";
import PromptDetail from "@/components/details/prompt-detail";
import UserDetail from "@/components/details/user-detail";
import { getIdFromDetailURL } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promptId = getIdFromDetailURL(slug);

  return (
    <h1 className="flex flex-col gap-2 p-4">
      <div>Accessing prompt with id {promptId}</div>
      <div className="basis-3/5 flex flex-col">
        <PromptDetail promptId={promptId} className=""></PromptDetail>
        <PromptCarousel prompts={[]}></PromptCarousel>
      </div>
      <UserDetail userId={""}></UserDetail>
    </h1>
  );
}
