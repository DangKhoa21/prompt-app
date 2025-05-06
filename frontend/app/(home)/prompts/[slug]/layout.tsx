import { DetailsHeader } from "@/components/details/details-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Detail",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DetailsHeader pageName="Prompt Detail"></DetailsHeader>
      <div className="min-h-screen">
        <div className="p-2 md:p-8 bg-muted">{children}</div>
      </div>
    </>
  );
}
