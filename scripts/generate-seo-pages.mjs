import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectDir, "dist");
const manifest = JSON.parse(await readFile(path.join(projectDir, "seo-pages.json"), "utf8"));
const shell = await readFile(path.join(distDir, "index.html"), "utf8");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceTag(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
}

function renderHead(page) {
  const canonicalPath = page.canonicalPath ?? page.path;
  const canonical = `${manifest.siteUrl}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const title = `${page.title} | The Kada`;
  const robots = page.indexable
    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    : "noindex,follow";
  let html = shell.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  const tags = [
    ["name", "description", page.description],
    ["name", "robots", robots],
    ["property", "og:title", title],
    ["property", "og:description", page.description],
    ["property", "og:type", "website"],
    ["property", "og:url", canonical],
    ["property", "og:site_name", "The Kada"],
    ["property", "og:image", `${manifest.siteUrl}/og.png`],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", page.description],
    ["name", "twitter:image", `${manifest.siteUrl}/og.png`],
  ];

  for (const [attribute, key, content] of tags) {
    const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
    const expression = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*>`, "i");
    html = replaceTag(html, expression, tag);
  }

  if (page.canonical === false) {
    html = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, "");
    html = html.replace(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, "");
  } else {
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
    html = replaceTag(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, canonicalTag);
  }
  html = html.replace(/<script\b(?=[^>]*\bdata-route-seo)[^>]*>[\s\S]*?<\/script>/gi, "");
  if (page.jsonLd) {
    const jsonLd = JSON.stringify(page.jsonLd).replace(/</g, "\\u003c");
    html = html.replace("</head>", `    <script type="application/ld+json" data-route-seo>${jsonLd}</script>\n  </head>`);
  }
  return html;
}

for (const page of manifest.routes) {
  const relativePath = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  const destination = path.join(distDir, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, renderHead(page));
}

const sitemapUrls = manifest.routes
  .filter((page) => page.sitemap)
  .map((page) => `  <url><loc>${manifest.siteUrl}${page.path === "/" ? "/" : page.path}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
