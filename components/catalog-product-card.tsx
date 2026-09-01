"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { QuickAddPanel } from "@/components/quick-add-panel";
import { isNewProduct } from "@/lib/catalog";
import { formatPrice, type Product } from "@/lib/products";

type CatalogProductCardProps = {
  product: Product;
  index: number;
};

function getDefaultSize(product: Product) {
  return (
    product.sizes.find((entry) => entry.label === "M")?.label ??
    product.sizes[0]?.label ??
    ""
  );
}

export function CatalogProductCard({ product, index }: CatalogProductCardProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const isNew = isNewProduct(product);
  const defaultSize = useMemo(() => getDefaultSize(product), [product]);

  return (
    <article className="w-full">
      <div className="group relative">
        <a
          href={`/catalog/${product.id}`}
          className="block touch-manipulation"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              draggable={false}
              className="object-contain transition-opacity duration-300 group-hover:opacity-0"
              quality={90}
              priority={index < 4}
            />
            {product.hoverImage ? (
              <Image
                src={product.hoverImage}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                draggable={false}
                className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                quality={90}
              />
            ) : null}
          </div>
        </a>

        <div className="absolute right-0 bottom-0 left-0 hidden items-center justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
          <div className="relative">
            <button
              type="button"
              aria-label="Добавить в корзину"
              className="flex size-9 items-center justify-center border border-[#e6e6e6] bg-white text-[#0c0c0c] transition-colors hover:border-[#0c0c0c]"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setQuickAddOpen((value) => !value);
              }}
            >
              <img src="/icons/bag.svg" alt="" width={16} height={16} />
            </button>
            {quickAddOpen ? (
              <QuickAddPanel
                product={product}
                onClose={() => setQuickAddOpen(false)}
              />
            ) : null}
          </div>
          <FavoriteButton productId={product.id} />
        </div>
      </div>

      <div className="mt-3 text-left">
        <a
          href={`/catalog/${product.id}`}
          className="block text-[13px] leading-[1.25] font-medium text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
        >
          {product.name}
        </a>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <p className="font-[Arial,Helvetica,sans-serif] text-[14px] leading-none text-[#0c0c0c]">
            {formatPrice(product.price)}
          </p>
          {isNew ? (
            <span className="bg-[#0c0c0c] px-1.5 py-0.5 text-[10px] leading-none font-normal text-white uppercase">
              Новинка
            </span>
          ) : null}
          {product.oldPrice ? (
            <span className="font-[Arial,Helvetica,sans-serif] text-[13px] leading-none text-[#8d8d8d] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2 md:hidden">
          <AddToCartButton
            productId={product.id}
            size={defaultSize}
            label="Добавить в корзину"
            compact
            className="min-w-0 text-[11px]"
          />
          <FavoriteButton
            productId={product.id}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e6e6e6] bg-white transition-colors hover:border-[#0c0c0c]"
            iconClassName="brightness-0"
            activeClassName="border-[#0c0c0c] bg-[#0c0c0c]"
          />
        </div>
      </div>
    </article>
  );
}
