import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const parsed = Number.parseInt(process.env.PORT ?? "", 10);
const port = Number.isFinite(parsed) && parsed > 0 ? parsed : 5173;

const distDir = path.join(__dirname, "dist");
const INDEX_MARKER = "<!--__SUPABASE_CONFIG__-->";

function buildSupabaseConfigScript() {
  const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "").trim();
  const anonKey = (
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  ).trim();
  const json = JSON.stringify({ url, anonKey }).replace(/</g, "\\u003c");
  return `<script>window.__APP_SUPABASE_CONFIG__=${json}</script>`;
}

app.use(express.static(distDir, { index: false }));

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }
  const htmlPath = path.join(distDir, "index.html");
  let html;
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch (err) {
    next(err);
    return;
  }
  if (html.includes(INDEX_MARKER)) {
    html = html.replace(INDEX_MARKER, buildSupabaseConfigScript());
  }
  res.type("html").send(html);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
