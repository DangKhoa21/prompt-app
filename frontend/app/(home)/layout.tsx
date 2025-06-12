import { SidebarLeft } from "@/components/sidebar/sidebar-left";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarLeft className="z-20" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
