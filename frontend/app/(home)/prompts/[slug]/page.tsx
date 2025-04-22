import DetailsWrapper from "@/components/details/details-wrapper";
import { getIdFromDetailURL } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promptId = getIdFromDetailURL(slug);

  return (
    <>
      <div className="min-h-screen">
        <div className="p-2 md:p-8 bg-muted">
          <DetailsWrapper promptId={promptId}></DetailsWrapper>
        </div>
      </div>
    </>
  );
}
