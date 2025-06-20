// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server", // this is required for SSR and functions
  site: "https://willturner.netlify.app",
  adapter: netlify(),
  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
