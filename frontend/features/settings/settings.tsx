import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings, ProfileSettings } from "@/features/settings";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "profile":
        return <ProfileSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  const tabItems = [
    { value: "general", label: "General" },
    { value: "profile", label: "Profile" },
  ];

  const renderSidebarContent = () => (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      orientation="vertical"
      className="w-full"
    >
      <TabsList className="flex flex-col items-start w-full h-auto p-0 bg-transparent">
        {tabItems.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="justify-start w-full px-4 py-2 text-left rounded-none data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <SettingsIcon />
          Settings
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden sm:max-h-[80vh] max-h-[90vh]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your settings here. You can adjust your preferences.
          </DialogDescription>
        </VisuallyHidden>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 h-9"
                >
                  {tabItems.find((tab) => tab.value === activeTab)?.label}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {tabItems.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    className={
                      activeTab === tab.value
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex h-[calc(100vh-10rem)] max-h-[600px] md:h-[80vh]">
          {/* Desktop Sidebar */}
          <div className="hidden w-64 border-r border-border bg-muted/50 md:block">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-medium">Settings</h2>
            </div>
            <ScrollArea className="h-[calc(100%-57px)]">
              {renderSidebarContent()}
            </ScrollArea>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-6">{renderTabContent()}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
