import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog-page";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HEADER_OFFSET } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог одежды DPE MOSCOW — футболки, худи, шорты и аксессуары.",
};

export default function CatalogRoutePage() {
  return (
    <>
      <Header />
      <main className={HEADER_OFFSET}>
        <Suspense>
          <CatalogPage />
        </Suspense>
        <Footer />
      </main>
    </>
  );
}
