import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // Resolve Carbon/IBM Plex `~pkg/...` imports
    loadPaths: ["node_modules"],
    silenceDeprecations: ["import", "global-builtin", "legacy-js-api"],
  },
};

export default nextConfig;
