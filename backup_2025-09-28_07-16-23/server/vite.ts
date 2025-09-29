import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viteLogger = createLogger();
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const clientPath = path.resolve(__dirname, "../client");
  
  // Créer le serveur Vite avec le hot reload
  const vite = await createViteServer({
    configFile: path.resolve(clientPath, "vite.config.ts"),
    server: {
      middlewareMode: true,
      hmr: {
        server: server,
        port: 5000,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: "spa",
    root: clientPath,
  });
  
  // Utiliser le middleware Vite
  app.use(vite.middlewares);
  
  // Servir les fichiers audio séparément
  app.use('/sounds', express.static(path.resolve(__dirname, "../sounds")));
  
  // Pour toutes les autres routes, servir index.html via Vite
  app.get(/^\/.*/, async (req, res, next) => {
    try {
      const url = req.originalUrl;
      
      // Laisser Vite transformer le HTML
      let template = await fs.promises.readFile(
        path.resolve(clientPath, "index.html"),
        "utf-8"
      );
      
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}