import { DetailsHeader } from "@/components/details/details-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DetailsHeader pageName={"Prompt detail"}></DetailsHeader>
      {children}
    </>
  );
}
