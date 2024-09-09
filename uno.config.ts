import { defineConfig, presetAttributify, presetWind } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind({
      dark: "class",
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        lato: "Lato",
      },
    }),
  ],
  variants: [
    (matcher) => {
      if (matcher.startsWith("htmx-request:")) {
        return {
          matcher: matcher.slice("htmx-request:".length),
          selector: (s) => `.htmx-request ${s}, ${s}.htmx-request`,
        };
      }
      if (matcher.startsWith("htmx-settling:")) {
        return {
          matcher: matcher.slice("htmx-settling:".length),
          selector: (s) => `.htmx-settling ${s}, ${s}.htmx-settling`,
        };
      }
      if (matcher.startsWith("htmx-swapping:")) {
        return {
          matcher: matcher.slice("htmx-swapping:".length),
          selector: (s) => `.htmx-swapping ${s}, ${s}.htmx-swapping`,
        };
      }
      if (matcher.startsWith("htmx-added:")) {
        return {
          matcher: matcher.slice("htmx-added:".length),
          selector: (s) => `.htmx-added ${s}, ${s}.htmx-added`,
        };
      }
    },
  ],
});
