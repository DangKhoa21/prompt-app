import { SidebarLeft } from "@/components/sidebar/sidebar-left";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarLeft className="z-20" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
