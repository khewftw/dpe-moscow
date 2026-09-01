"use client";

import { ProductSlider } from "@/components/product-slider";
import { PAGE_X } from "@/lib/ui";
import { bestsellers } from "@/lib/products";

export function Bestsellers() {
  return (
    <section className="bg-white">
      <div
        className={`flex flex-col gap-1 pt-14 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-20 ${PAGE_X}`}
      >
        <h2 className="text-[18px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[20px]">
          Бестселлеры
        </h2>
        <p className="text-[13px] leading-[1.15] font-medium text-[#8d8d8d] uppercase sm:text-[20px]">
          collection // SS2026
        </p>
      </div>

      <ProductSlider products={bestsellers} />
    </section>
  );
}
