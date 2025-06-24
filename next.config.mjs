/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://s4.anilist.co/**")],
  },
};

export default nextConfig;
