import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import { networkInterfaces } from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fonction pour obtenir l'adresse IP locale
function getLocalIpAddress(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        net.address !== "127.0.0.1"
      ) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const app = express();

// Sécurité HTTP
import helmet from "helmet";
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

// Servir les fichiers statiques du dossier sounds
app.use("/sounds", express.static(path.join(__dirname, "..", "sounds")));

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
  const execAsync = promisify(exec);

  // Fonction pour fermer le processus utilisant le port 5000
  async function killProcessOnPort(port: number): Promise<boolean> {
    try {
      if (process.platform === "win32") {
        // Windows
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.split("\n");
        for (const line of lines) {
          if (line.includes(`:${port}`) && line.includes("LISTENING")) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(parseInt(pid))) {
              await execAsync(`taskkill /F /PID ${pid}`);
              log(`Killed process ${pid} using port ${port}`);
              return true;
            }
          }
        }
      } else {
        // Linux/Mac
        const { stdout } = await execAsync(`lsof -ti:${port}`);
        const pids = stdout.trim().split("\n");
        for (const pid of pids) {
          if (pid) {
            await execAsync(`kill -9 ${pid}`);
            log(`Killed process ${pid} using port ${port}`);
          }
        }
        return pids.length > 0;
      }
    } catch (error) {
      // Aucun processus trouvé ou erreur
    }
    return false;
  }

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Essayer de démarrer le serveur, et si le port est occupé, tuer le processus et réessayer
  try {
    const localIp = getLocalIpAddress();
    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port}`);
      log(`Local access: http://127.0.0.1:${port}`);
      log(`Network access: http://${localIp}:${port}`);
      log(
        `🌐 For internet access, you need to configure port forwarding on your router`
      );
      log(`🌐 Or use a tunnel service like ngrok: ngrok http ${port}`);
    });
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      log(`Port ${port} is in use. Attempting to kill the process...`);
      const killed = await killProcessOnPort(port);

      if (killed) {
        // Attendre un peu que le port se libère
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Réessayer de démarrer le serveur
        try {
          const localIp = getLocalIpAddress();
          server.listen(port, "0.0.0.0", () => {
            log(`Server running at http://0.0.0.0:${port}`);
            log(`Local access: http://127.0.0.1:${port}`);
            log(`Network access: http://${localIp}:${port}`);
            log(
              `🌐 For internet access, you need to configure port forwarding on your router`
            );
            log(`🌐 Or use a tunnel service like ngrok: ngrok http ${port}`);
          });
        } catch (retryError: any) {
          log(
            `Failed to start server after killing process: ${retryError.message}`
          );
          process.exit(1);
        }
      } else {
        log(
          `Could not find process using port ${port}. Please check manually.`
        );
        process.exit(1);
      }
    } else {
      log(`Error starting server: ${error.message}`);
      process.exit(1);
    }
  }
})();
