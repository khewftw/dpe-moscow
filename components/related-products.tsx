import { ProductCard } from "@/components/product-card";
import { PAGE_X } from "@/lib/ui";
import { getRelatedProducts } from "@/lib/products";

type RelatedProductsProps = {
  productId: string;
};

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const products = getRelatedProducts(productId);

  if (!products.length) return null;

  return (
    <section className={`border-t border-[#e6e6e6] bg-white pt-16 pb-20 ${PAGE_X}`}>
      <h2 className="text-[20px] leading-[1.15] font-medium text-[#0c0c0c] uppercase">
        Смотрите также
      </h2>

      <div className="mt-5 flex gap-[2px] overflow-x-auto pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
