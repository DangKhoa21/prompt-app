import { MarketHeader } from "@/components/marketplace/market-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Marketplace",
  description: "Shopping for your desire templates",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketHeader />
      {children}
    </>
  );
}
