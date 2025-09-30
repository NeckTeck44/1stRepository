import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  plugins: {
    tailwindcss: {
      // Absolute path so it works regardless of current working directory
      // Use CJS config to avoid ESM interop issues with PostCSS/Tailwind v3
      config: path.resolve(__dirname, "../config/tailwind.config.cjs"),
    },
    autoprefixer: {},
  },
};
