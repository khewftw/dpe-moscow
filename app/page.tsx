import { AboutSection } from "@/components/about-section";
import { Bestsellers } from "@/components/bestsellers";
import { Categories } from "@/components/categories";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { NewArrivals } from "@/components/new-arrivals";
import { SocialProof } from "@/components/social-proof";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Bestsellers />
      <Categories />
      <NewArrivals />
      <AboutSection />
      <SocialProof />
      <Footer />
    </>
  );
}
