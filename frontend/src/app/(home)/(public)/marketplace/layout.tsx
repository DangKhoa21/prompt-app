import { MarketHeader } from "@/components/marketplace/market-header";
import { appURL } from "@/config/url.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: appURL.marketplace,
  },

  title: "Marketplace",
  description:
    "Discover and shop for high-quality prompt templates tailored to your needs.",
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
