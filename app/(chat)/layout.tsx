import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarProvider2>
        <SidebarLeft />
        <SidebarInset>{children}</SidebarInset>
        <SidebarRight />
      </SidebarProvider2>
    </SidebarProvider>
  );
}
