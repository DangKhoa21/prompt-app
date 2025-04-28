import { DetailsHeader } from "@/components/details/details-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Detail",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DetailsHeader pageName="Profile Detail"></DetailsHeader>
      {children}
    </>
  );
}
