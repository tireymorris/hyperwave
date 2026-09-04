import { defineConfig, presetWind } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
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
