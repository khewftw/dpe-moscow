import { HomeProductTile } from "@/components/home-product-tile";
import { getLookImage, type Product } from "@/lib/products";

export function HomeProductGrid({
  products,
  variant,
}: {
  products: Product[];
  variant: "studio" | "look";
}) {
  return (
    <section
      className="grid grid-cols-2 bg-white lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <HomeProductTile
          key={`${product.id}-${variant}-${index}`}
          product={product}
          image={variant === "look" ? getLookImage(product) : product.image}
          variant={variant}
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
      ))}
    </section>
  );
}
