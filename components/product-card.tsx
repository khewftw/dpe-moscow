import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="w-[calc(50vw-22px)] shrink-0 sm:w-[260px] lg:w-[350px]">
      <a href={`/catalog/${product.id}`} className="block touch-manipulation">
        <div className="group/photo relative aspect-square w-full overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 260px, 350px"
            draggable={false}
            className="object-contain"
            quality={90}
          />
          {product.hoverImage ? (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 260px, 350px"
              draggable={false}
              className="object-contain object-center opacity-0 transition-opacity duration-[400ms] ease-out group-hover/photo:opacity-100"
              quality={90}
            />
          ) : null}
          {product.discount ? (
            <span className="absolute top-2 right-2 z-10 flex size-9 items-center justify-center rounded-full bg-black text-[11px] leading-none font-normal text-white">
              {product.discount}
            </span>
          ) : null}
        </div>

        <div className="mt-2.5 px-2 text-center text-[14px] leading-[1.2] text-[#0c0c0c] uppercase">
          <h3 className="font-medium">{product.name}</h3>
          <p className="mt-0.5 font-normal">{product.manual}</p>
          <p className="mt-0.5 font-normal normal-case">
            <span>{formatPrice(product.price)}</span>
            {product.oldPrice ? (
              <span className="ml-1.5 text-[#6d6d6d] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </p>
        </div>
      </a>
    </article>
  );
}
