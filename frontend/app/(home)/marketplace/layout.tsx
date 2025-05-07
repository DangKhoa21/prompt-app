import { MarketHeader } from "@/components/marketplace/market-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Marketplace",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketHeader />
      {children}
    </>
  );
}
