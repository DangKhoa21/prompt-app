import { MarketHeader } from "@/components/marketplace/market-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketHeader></MarketHeader>
      {children}
    </>
  );
}
