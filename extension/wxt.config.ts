import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["sidePanel", "storage"],
    action: {},
    name: "Prompt App",
    description: "A helpful tool for quicker prompting",
  },
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  publicDir: "public",
});
