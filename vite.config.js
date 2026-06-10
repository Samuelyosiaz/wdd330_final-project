import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        laptops: resolve(__dirname, "src/laptops/index.html"),
        lightning_deals: resolve(__dirname, "src/lightning_deals/index.html"),
        phones: resolve(__dirname, "src/phones/index.html"),
        vs: resolve(__dirname, "src/vs/index.html"),
        wish_list: resolve(__dirname, "src/wish_list/index.html"),
      },
    },
  },
});
