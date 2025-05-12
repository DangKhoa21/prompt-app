import { useState } from "react";

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    browser.tabs.get(activeInfo.tabId).then((tab) => {
      if (tab.url) {
        const url = new URL(tab.url);
        setSearchParams(url.searchParams);
      }
    });
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      const url = new URL(changeInfo.url);
      setSearchParams(url.searchParams);
    }
  });

  return searchParams;
}
