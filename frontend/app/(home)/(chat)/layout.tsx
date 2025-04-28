import { SidebarRight } from "@/components/sidebar/sidebar-right";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Chat",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider2>
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider2>
  );
}
