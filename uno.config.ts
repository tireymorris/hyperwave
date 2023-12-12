import { defineConfig, presetAttributify, presetWind } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind(),
    presetWebFonts({
      provider: "google",
      fonts: {
        lato: "Lato",
      },
    }),
  ],
});
