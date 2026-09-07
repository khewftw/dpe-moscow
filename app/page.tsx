import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HomeProductGrid } from "@/components/home-product-grid";
import { HomeProductPair } from "@/components/home-product-pair";
import { HomePromo } from "@/components/home-promo";
import { HomeTeaser } from "@/components/home-teaser";
import { getAllProducts } from "@/lib/products";

export default function Home() {
  const products = getAllProducts();
  const first = products[0];
  const second = products[1] ?? products[0];
  const third = products[2] ?? products[0];

  if (!first) {
    return (
      <>
        <Header hero />
        <Hero />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header hero />
      <Hero />
      <HomeProductPair products={[first, second]} preloadFirst />
      <HomeTeaser />
      <HomeProductPair products={[third, first]} />
      <HomePromo />
      <HomeProductGrid
        products={[first, second, third, first]}
        variant="studio"
      />
      <HomeProductGrid
        products={[first, second, third, second]}
        variant="look"
      />
      <Footer />
    </>
  );
}
