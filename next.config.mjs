/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
      staleTimes:{
          dynamic:30,
      }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
