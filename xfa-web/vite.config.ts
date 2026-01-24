    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react-swc";
    import path from "path";

    // https://vitejs.dev/config/
    export default defineConfig(({ mode }) => ({
      server: {
        host: mode === 'development' ? "localhost" : "::",
        port: 8080,
        // Proxy para redirecionar requisições /api/* para o backend em desenvolvimento
        proxy: {
          '/api': {
            target: 'http://localhost:8081',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [
        react(),
      ].filter(Boolean),
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    }));
