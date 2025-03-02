import { getIdFromDetailURL } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promptId = getIdFromDetailURL(slug);

  return <h1>Accessing prompt with id {promptId} </h1>;
}
