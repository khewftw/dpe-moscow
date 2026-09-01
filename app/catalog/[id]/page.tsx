import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductDetail } from "@/components/product-detail";
import { RelatedProducts } from "@/components/related-products";
import { HEADER_OFFSET } from "@/lib/ui";
import { getAllProductIds, getProductById } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Товар не найден" };
  }

  return {
    title: product.name,
    description: `${product.name} — ${product.manual}. ${product.composition}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className={HEADER_OFFSET}>
        <ProductDetail product={product} />
        <RelatedProducts productId={product.id} />
        <Footer />
      </main>
    </>
  );
}
