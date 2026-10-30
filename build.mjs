// Gera um único HTML autocontido: dist/orcamentos.html (abre no navegador e imprime em PDF)
// e dist/artifact.html (mesmo conteúdo, sem o esqueleto <html>, para a prévia publicada).
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";

const r = await build({
  entryPoints: ["src/main.jsx"],
  bundle: true, minify: true, write: false, outdir: "out",
  loader: { ".svg": "text", ".jpg": "dataurl" }, jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});
const js = r.outputFiles.find((f) => f.path.endsWith(".js")).text.replace(/<\/script/g, "<\\/script");
const css = r.outputFiles.find((f) => f.path.endsWith(".css")).text;

const head = `<title>Sistema Renovar</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&display=swap">
<style>${css}</style>`;
const body = `<div id="root"></div>\n<script>${js}</script>`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/artifact.html", `${head}\n${body}\n`);
const pagina = `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
writeFileSync("dist/orcamentos.html", pagina);
writeFileSync("dist/index.html", pagina);
console.log("ok", (js.length / 1024).toFixed(0) + "KB js");
