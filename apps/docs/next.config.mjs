import createMDX from "@next/mdx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@pixel3d/ui"],
  outputFileTracingRoot: root,
  turbopack: { root },
  devIndicators: false,
};

const withMDX = createMDX({ options: { remarkPlugins: [["remark-gfm"]] } });
export default withMDX(nextConfig);
