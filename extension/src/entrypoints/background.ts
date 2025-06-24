import { onMessage } from "@/lib/messaging";

export default defineBackground(() => {
  //console.log("Hello background!", { id: browser.runtime.id });
  //console.log("Current URL in background:", browser.runtime.getURL(""));

  browser.sidePanel
    .setPanelBehavior({
      openPanelOnActionClick: true,
    })
    .catch((error) => {
      console.error("Error setting side panel behavior:", error);
    });

  const allowedMatchPatterns = [
    new MatchPattern("*://*.chatgpt.com/*"),
    new MatchPattern("*://*.gemini.google.com/*"),
    new MatchPattern("*://*.claude.ai/*"),
    new MatchPattern("*://*.chat.deepseek.com/*"),
  ];

  browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;

    if (
      allowedMatchPatterns.some((pattern) =>
        pattern.includes(tab.url as string)
      )
    ) {
      // Enables the side panel on allowed sites
      await browser.sidePanel.setOptions({
        tabId,
        path: "sidepanel.html",
        enabled: true,
      });
    } else {
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
