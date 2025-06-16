import { onMessage } from "@/lib/messaging";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  console.log("Current URL in background:", browser.runtime.getURL(""));

  browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });

  onMessage("getActiveTab", async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  });
});
