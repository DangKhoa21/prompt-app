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
      <DetailsWrapper promptId={promptId}></DetailsWrapper>
    </>
  );
}
