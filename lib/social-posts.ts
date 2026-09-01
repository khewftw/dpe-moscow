export type SocialPost = {
  id: string;
  username: string;
  verified?: boolean;
  avatar: string;
  image: string;
  href?: string;
};

export const socialPosts: SocialPost[] = [
  {
    id: "dpe-moscow",
    username: "dpe.moscow",
    verified: true,
    avatar: "/dpe-logo.svg",
    image: "/images/products/tee-pohuy/model.png",
    href: "https://instagram.com",
  },
  {
    id: "street-msk",
    username: "streetwear.msk",
    verified: true,
    avatar: "/images/products/tee-zhertva/model.png",
    image: "/images/Man_standing_against_stone_wall_202609011007.jpeg",
    href: "https://instagram.com",
  },
  {
    id: "katya-fit",
    username: "katya_golden",
    verified: true,
    avatar: "/images/categories/Young_man_standing_outdoors_2K_202609011033.jpeg",
    image: "/images/products/tee-ne-zamechayu/model.png",
    href: "https://instagram.com",
  },
  {
    id: "urban-pulse",
    username: "urban.pulse",
    avatar: "/images/products/tee-ne-zamechayu/front.png",
    image: "/images/categories/Man_sitting_wearing_athletic_shorts_202609011039.jpeg",
    href: "https://instagram.com",
  },
  {
    id: "dpe-crew",
    username: "dpe.crew",
    avatar: "/images/products/tee-pohuy/front.png",
    image: "/Man_standing_in_city_traffic_202609010927.jpeg",
    href: "https://instagram.com",
  },
  {
    id: "moscow-fit",
    username: "moscow.fit",
    verified: true,
    avatar: "/images/products/tee-zhertva/front.png",
    image: "/images/products/tee-zhertva/model.png",
    href: "https://instagram.com",
  },
  {
    id: "night-walk",
    username: "night.walk.msk",
    avatar: "/images/categories/hoodie.jpeg",
    image: "/images/categories/Young_man_standing_outdoors_2K_202609011033.jpeg",
    href: "https://instagram.com",
  },
];
