import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@pixel3d/ui"],
  outputFileTracingRoot: root,
  turbopack: { root },
  devIndicators: false,
  // the dev server is shared through a Cloudflare tunnel
  allowedDevOrigins: ["grokmate.codergaut.am", "*.trycloudflare.com"],
};
export default nextConfig;
