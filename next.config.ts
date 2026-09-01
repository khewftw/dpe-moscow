import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/Man_standing_in_city_traffic_202609010927.jpeg",
      },
      {
        pathname: "/Man_posing_in_distressed_t-shirt_202609011608.jpeg",
      },
    ],
  },
};

export default nextConfig;
