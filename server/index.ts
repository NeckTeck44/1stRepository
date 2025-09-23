import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer as createNetServer } from "net";

const app = express();

// Sécurité HTTP
import helmet from "helmet";
// In development, relax CSP so Vite HMR and React preamble can work
if (app.get("env") === "development") {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      // Keep other protections enabled
      crossOriginEmbedderPolicy: false,
    })
  );
} else {
  app.use(helmet());
}

// CORS (utile si frontend et backend sont séparés)
import cors from "cors";
app.use(cors());

// Parsing des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger API intelligent
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "...";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  // Middleware d'erreur global
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`ERROR ${status}: ${message}`);
  });

  const port = parseInt(process.env.PORT || "5000", 10);
  const server = createServer(app);

  async function getAvailablePort(start: number): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
      const tester = createNetServer()
        .once("error", (err: any) => {
          if (err?.code === "EADDRINUSE") {
            // Try the next port
            tester.removeAllListeners();
            getAvailablePort(start + 1).then(resolve).catch(reject);
          } else {
            reject(err);
          }
        })
        .once("listening", () => {
          tester.close(() => resolve(start));
        })
        .listen(start, "127.0.0.1");
    });
  }

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const selectedPort = await getAvailablePort(port);
  if (selectedPort !== port) {
    log(`Port ${port} is in use. Switching to ${selectedPort}`);
  }

  server.listen(selectedPort, "127.0.0.1", () => {
    log(`Server running at http://127.0.0.1:${selectedPort}`);
  });
})();