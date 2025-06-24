import { onMessage } from "@/lib/messaging";

export default defineContentScript({
  matches: [
    "*://*.chatgpt.com/*",
    "*://*.gemini.google.com/*",
    "*://*.claude.ai/*",
    "*://*.chat.deepseek.com/*",
  ],
  //matches: ["<all_urls>"],
  main() {
    //console.log("Hello content.");

    onMessage("replaceCurrentUrl", (msg) => {
      const url = msg.data.url;
      window.history.replaceState(null, "", url);
    });

    onMessage("setPrompt", (msg) => {
      const { value } = msg.data;

      const currentUrl = window.location.href;
      //console.log("Current URL in content script:", currentUrl);

      let promptInput;
      if (currentUrl.includes("chatgpt.com")) {
        promptInput = document.querySelector("#prompt-textarea");
      } else if (currentUrl.includes("gemini.google.com")) {
        promptInput = document.querySelector(
          'div.ql-editor.textarea[contenteditable="true"]'
        );
      } else if (currentUrl.includes("claude.ai")) {
        promptInput = document.querySelector(
          'div.ProseMirror[contenteditable="true"]'
        );
      } else if (currentUrl.includes("chat.deepseek.com")) {
        promptInput = document.querySelector("#chat-input");
      }

      if (promptInput) {
        promptInput.innerHTML = value;
        promptInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  },
});
