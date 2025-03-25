import UserDetail from "@/components/details/user-detail";
import { MarketHeader } from "@/components/marketplace/market-header";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <MarketHeader></MarketHeader>
      <UserDetail userId={id} className="mt-2 mx-8"></UserDetail>
    </>
  );
}
