import { onMessage, sendMessage } from "@/lib/messaging";

export default defineContentScript({
  matches: ["*://*.chatgpt.com/*"],
  main() {
    console.log("Hello content.");

    onMessage("replaceCurrentUrl", (msg) => {
      console.log("replaceCurrentUrl", msg);
      const url = msg.data.url;
      window.history.replaceState(null, "", url);
    });
  },
});
