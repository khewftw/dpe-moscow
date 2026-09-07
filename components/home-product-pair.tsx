import { HomeProductTile } from "@/components/home-product-tile";
import { getLookImage, type Product } from "@/lib/products";

export function HomeProductPair({
  products,
  preloadFirst = false,
}: {
  products: [Product, Product];
  preloadFirst?: boolean;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {products.map((product, index) => (
        <HomeProductTile
          key={`${product.id}-feature-${index}`}
          product={product}
          image={getLookImage(product)}
          variant="feature"
          sizes="(max-width: 768px) 100vw, 50vw"
          preload={preloadFirst && index === 0}
        />
      ))}
    </section>
  );
}
