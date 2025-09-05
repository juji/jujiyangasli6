import type { NextConfig } from "next";

import withSerwistInit from "@serwist/next";


const nextConfig: NextConfig = {
  output: "export",

  // Add any custom Next.js config here if needed
  devIndicators: false,
  
  // Note: With output: 'export', the headers won't be automatically applied to the static files.
  // You'll need to configure these headers in your hosting provider/server instead.
  async headers() {
    return [
      {
        // Apply to all paths
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist(nextConfig);
