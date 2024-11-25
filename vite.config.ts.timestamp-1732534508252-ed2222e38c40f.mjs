// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/Anysoft-User/Desktop/nkmk-warehouse/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Anysoft-User/Desktop/nkmk-warehouse/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/Users/Anysoft-User/Desktop/nkmk-warehouse/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Anysoft-User/Desktop/nkmk-warehouse/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    sourcemap: false,
    emptyOutDir: true,
    minify: "esbuild"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbnlzb2Z0LVVzZXJcXFxcRGVza3RvcFxcXFxua21rLXdhcmVob3VzZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQW55c29mdC1Vc2VyXFxcXERlc2t0b3BcXFxcbmttay13YXJlaG91c2VcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FueXNvZnQtVXNlci9EZXNrdG9wL25rbWstd2FyZWhvdXNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2dWUoKSxcclxuICAgICAgICB2dWVEZXZUb29scygpXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIHRhcmdldDogXCJlc25leHRcIixcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmpzXCIsXHJcbiAgICAgICAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcclxuICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcIltuYW1lXS5bZXh0XVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgbWluaWZ5OiBcImVzYnVpbGRcIlxyXG4gICAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVSxTQUFTLGVBQWUsV0FBVztBQUNuVyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFIaUwsSUFBTSwyQ0FBMkM7QUFLMVAsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLEVBQ2hCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDcEI7QUFBQSxJQUNKO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsRUFDWjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
