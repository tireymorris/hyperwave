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
});
