import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["sidePanel", "storage", "tabs"],
    action: {},
    name: "Prompt Crafter",
    description: "A helpful tool for quicker prompting",
    version: "0.2.0",
    host_permissions: [
      "https://chatgpt.com/*",
      "https://gemini.google.com/*",
      "https://claude.ai/*",
      "https://chat.deepseek.com/*",
    ],
    key: `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Ix0DZse57rnaIkrpuye1ZLu5jTdmceGiVG16sKGuvkHxEUcyQvPtJ0Fw42hG0rywx1vEpkIn90Nqim1rr8BGc3miIUzyhC4WvOKoZOjIkAoFVMD2mQCSbKd5/ujrEQVdGHvQzUh/hXstsKVYyl+FMcChlHxjyRBNWEa7+7oVHL8H3S3im6WJkyW19Ray6qQtjFPM02i8NUGJ5HY5lTOvaS7+sJ7qaVbhOllkCINGmzs4yO/+B9Ty5OnWnVH4/AMOFmFHOtVvwCWAAwS+Wr6PyWHGV7+7aM01wtpafjsl5XM8XKDXd90Jlep9qIOuhXUSxD5pcr/C4vlkSjVxroVsQIDAQAB`,
    oauth2: {
      client_id:
        "553566387069-m05c0rj5bvsefl4v07mi4h0msoh79goq.apps.googleusercontent.com",
      scopes: [],
    },
  },
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  publicDir: "public",
  webExt: {
    chromiumArgs: ["--disable-features=DisableLoadExtensionCommandLineSwitch"],
    // This is because Chrome's latest update broke dev mode by removing the --load-extension flag,
    // so the extension no longer loads automatically at startup.
  },
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      // To remove the side_panel.default_path from the manifest
      if ((manifest as any).side_panel) {
        delete (manifest as any).side_panel;
      }
    },
  },
});
