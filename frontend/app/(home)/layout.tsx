import { SidebarLeft } from "@/components/sidebar/sidebar-left";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const lastState = cookieStore.get("sidebar:state")?.value;
  const defaultOpen = lastState ? lastState === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarLeft className="z-20" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
