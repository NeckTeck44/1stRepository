import 'tsconfig-paths/register';
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// recrée __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Démarre le serveur Express (qui embarque Vite en mode middleware)
spawn("npx", ["tsx", "-r", "tsconfig-paths/register", "index.ts"], {
  cwd: path.resolve(__dirname, "server"),
  stdio: "inherit",
  shell: true,
});