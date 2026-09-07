import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Event and banner images are arbitrary URLs pasted by the admin
    // (there's no upload/storage pipeline), so we can't know every
    // hostname in advance. Allow any HTTPS host rather than maintaining
    // an allowlist that would break every time a new image URL is used.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
