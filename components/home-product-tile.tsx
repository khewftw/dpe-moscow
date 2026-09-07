"use client";

import Image from "next/image";
import { useState } from "react";
import { QuickAddPanel } from "@/components/quick-add-panel";
import { formatPrice, type Product } from "@/lib/products";

type HomeProductTileProps = {
  product: Product;
  image: string;
  variant: "feature" | "studio" | "look";
  sizes: string;
  preload?: boolean;
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function HomeProductTile({
  product,
  image,
  variant,
  sizes,
  preload = false,
}: HomeProductTileProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const isFeature = variant === "feature";
  const isStudio = variant === "studio";
  const overlayCaption = !isStudio;

  return (
    <article
      className={`group relative ${
        isFeature
          ? "h-[100svh] min-h-[560px]"
          : isStudio
            ? "w-full"
            : "min-h-[70svh] lg:h-[85svh]"
      }`}
    >
      <a
        href={`/catalog/${product.id}`}
        className={`relative block overflow-hidden bg-white ${
          isFeature || !isStudio ? "h-full" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload ? "eager" : "lazy"}
          quality={90}
          className={
            isStudio
              ? "object-contain object-center p-8 transition-transform duration-700 group-hover:scale-[1.03]"
              : "object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          }
        />
      </a>

      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            type="button"
            aria-label={`Добавить ${product.name} в корзину`}
            className={`flex size-8 items-center justify-center transition-opacity hover:opacity-60 ${
              isStudio ? "text-[#0c0c0c]" : "text-white mix-blend-difference"
            }`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setQuickAddOpen((value) => !value);
            }}
          >
            <PlusIcon />
          </button>
          {quickAddOpen ? (
            <QuickAddPanel
              product={product}
              placement="bottom"
              onClose={() => setQuickAddOpen(false)}
            />
          ) : null}
        </div>
      </div>

      {overlayCaption ? (
        <a
          href={`/catalog/${product.id}`}
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 text-white mix-blend-difference sm:p-5"
        >
          <h3 className="max-w-[70%] text-[11px] leading-[1.3] tracking-[0.16em] uppercase sm:text-[12px]">
            {product.name}
          </h3>
          <p className="text-[11px] leading-none tracking-[0.08em] sm:text-[12px]">
            {formatPrice(product.price)}
          </p>
        </a>
      ) : (
        <div className="flex items-start justify-between gap-3 px-4 pt-3 pb-8 sm:px-5">
          <a
            href={`/catalog/${product.id}`}
            className="text-[11px] leading-[1.35] tracking-[0.14em] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
          >
            {product.name}
          </a>
          <p className="shrink-0 text-[11px] leading-[1.35] tracking-[0.08em] text-[#0c0c0c]">
            {formatPrice(product.price)}
          </p>
        </div>
      )}
    </article>
  );
}
