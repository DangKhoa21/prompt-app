import { onMessage } from "@/lib/messaging";

export default defineContentScript({
  // matches: ["*://*.chatgpt.com/*"],
  matches: ["<all_urls>"],
  main() {
    console.log("Hello content.");

    onMessage("replaceCurrentUrl", (msg) => {
      const url = msg.data.url;
      window.history.replaceState(null, "", url);
    });

    onMessage("setPrompt", (msg) => {
      const { value } = msg.data;
      const promptInput = document.querySelector("#prompt-textarea");

      if (promptInput) {
        promptInput.innerHTML = value;
        promptInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  },
});
