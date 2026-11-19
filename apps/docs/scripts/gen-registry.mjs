// Builds the shadcn registry for pixel3d-ui.
// 1. Reads each doc module in content/components/*.tsx for slug / name / summary / files /
//    dependencies / registryDependencies (string literals).
// 2. Copies the referenced package sources into registry-src/, rewriting monorepo-relative
//    imports to the paths they will have in a user's project:
//       ../lib/utils            → @/lib/pixel3d
//       ./<component>           → @/components/ui/<component>
//       ../components/<c>       → @/components/ui/<c>
//       ../three/<x> / ./<x>    → @/components/ui/three/<x>   (inside three/)
// 3. Writes registry.json; `shadcn build` then emits public/r/*.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.join(here, "..");
const uiSrc = path.join(docsRoot, "../../packages/ui/src");
const outSrc = path.join(docsRoot, "registry-src");
const contentDir = path.join(docsRoot, "content/components");

fs.rmSync(outSrc, { recursive: true, force: true });
fs.mkdirSync(outSrc, { recursive: true });

const uiPkg = JSON.parse(fs.readFileSync(path.join(uiSrc, "../package.json"), "utf8"));
const versions = uiPkg.dependencies;
const withVersion = (d) => (versions[d] ? `${d}@${versions[d]}` : d);

function rewrite(code, relFile) {
  const inThree = relFile.startsWith("three/");
  return code
    .replace(/from "\.\.\/lib\/utils"/g, 'from "@/lib/pixel3d"')
    .replace(/from "\.\.\/components\/([\w-]+)"/g, 'from "@/components/ui/$1"')
    .replace(/from "\.\.\/three\/([\w-]+)"/g, 'from "@/components/ui/three/$1"')
    .replace(/from "\.\/([\w-]+)"/g, inThree ? 'from "@/components/ui/three/$1"' : 'from "@/components/ui/$1"');
}

function targetFor(relFile) {
  if (relFile === "lib/utils.ts") return "lib/pixel3d.ts";
  if (relFile.startsWith("components/")) return `components/ui/${relFile.slice("components/".length)}`;
  if (relFile.startsWith("three/")) return `components/ui/three/${relFile.slice("three/".length)}`;
  if (relFile.startsWith("styles/")) return `app/${relFile.slice("styles/".length)}`;
  return relFile;
}

function typeFor(relFile) {
  if (relFile.startsWith("lib/")) return "registry:lib";
  if (relFile.startsWith("styles/")) return "registry:file";
  return "registry:ui";
}

function copy(relFile) {
  const src = path.join(uiSrc, relFile);
  const code = fs.readFileSync(src, "utf8");
  const out = path.join(outSrc, relFile);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, relFile.endsWith(".css") ? code : rewrite(code, relFile));
  return { path: `registry-src/${relFile}`, type: typeFor(relFile), target: targetFor(relFile) };
}

const str = (src, k) => src.match(new RegExp(`\\b${k}:\\s*"([^"]+)"`))?.[1];
const arr = (src, k) => {
  const m = src.match(new RegExp(`\\b${k}:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
};

// the material: every item depends on it
const styleFiles = fs.readdirSync(path.join(uiSrc, "styles")).filter((f) => f.endsWith(".css"));
const items = [
  {
    name: "pixel3d",
    type: "registry:style",
    title: "pixel3d-ui material",
    description: "The sticker material: tokens, utilities, keyframes and the Bricolage Grotesque font. Import app/pixel3d.css after tailwindcss.",
    dependencies: [withVersion("@fontsource-variable/bricolage-grotesque"), withVersion("clsx"), withVersion("tailwind-merge")],
    files: [...styleFiles.map((f) => copy(`styles/${f}`)), copy("lib/utils.ts")],
  },
];

for (const f of fs.readdirSync(contentDir).filter((f) => f.endsWith(".tsx") && !f.startsWith("_")).sort()) {
  const src = fs.readFileSync(path.join(contentDir, f), "utf8");
  const slug = str(src, "slug");
  if (!slug) continue;
  // lib/utils + styles/* already ship in the base "pixel3d" item
  const files = arr(src, "files").filter((x) => x !== "lib/utils.ts" && !x.startsWith("styles/"));
  const missing = files.filter((x) => !fs.existsSync(path.join(uiSrc, x)));
  if (missing.length) {
    console.warn(`[gen-registry] ${slug}: missing ${missing.join(", ")}; skipped`);
    continue;
  }
  const deps = arr(src, "dependencies");
  const devVersions = uiPkg.devDependencies;
  items.push({
    name: slug,
    type: "registry:ui",
    title: str(src, "name") ?? slug,
    description: str(src, "summary") ?? "",
    dependencies: deps.map(withVersion),
    ...(deps.includes("three") ? { devDependencies: [`@types/three@${devVersions["@types/three"]}`] } : {}),
    registryDependencies: ["@pixel3d/pixel3d", ...arr(src, "registryDependencies").map((d) => (d.includes("/") || d.startsWith("http") ? d : `@pixel3d/${d}`))],
    files: files.map(copy),
  });
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "pixel3d",
  homepage: "http://localhost:3000",
  items,
};
fs.writeFileSync(path.join(docsRoot, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`[gen-registry] ${items.length} registry items`);
