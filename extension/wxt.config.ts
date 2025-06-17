import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["sidePanel", "storage", "tabs"],
    action: {},
    name: "Prompt App",
    description: "A helpful tool for quicker prompting",
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
