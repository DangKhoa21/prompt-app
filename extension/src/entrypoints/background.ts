import { onMessage } from "@/lib/messaging";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  console.log("Current URL in background:", browser.runtime.getURL(""));

  browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });

  const allowedUrls = [
    "https://chatgpt.com",
    "https://gemini.google.com",
    "https://claude.ai",
    "https://chat.deepseek.com",
  ];

  browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;

    if (allowedUrls.some((url) => tab.url?.startsWith(url))) {
      console.log("Enabling side panel for:", tab.url);
      // Enables the side panel on allowed sites
      await browser.sidePanel.setOptions({
        tabId,
        path: "sidepanel.html",
        enabled: true,
      });
    } else {
      console.log("Disabling side panel for:", tab.url);
      // Disables the side panel on all other sites
      await browser.sidePanel.setOptions({
        tabId,
        enabled: false,
      });
    }
  });

  onMessage("getActiveTab", async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  });
});
