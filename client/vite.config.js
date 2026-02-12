import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Development server port
  },
  preview: {
    port: 10000, // Render's default port
    allowedHosts: ["project-frontend-bdja.onrender.com"], // Add your Render domain here
  },
});
