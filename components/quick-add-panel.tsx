"use client";

import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/products";

type QuickAddPanelProps = {
  product: Product;
  onClose: () => void;
  placement?: "top" | "bottom";
};

export function QuickAddPanel({
  product,
  onClose,
  placement = "top",
}: QuickAddPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(
    product.sizes.find((entry) => entry.label === "M")?.label ??
      product.sizes[0]?.label ??
      "",
  );

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 z-20 w-[min(280px,calc(100vw-40px))] border border-[#e6e6e6] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ${
        placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-[12px] leading-none text-[#8d8d8d] uppercase">
        Размер
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.sizes.map((entry) => (
          <button
            key={entry.label}
            type="button"
            onClick={() => setSize(entry.label)}
            className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[12px] leading-none uppercase transition-colors ${
              size === entry.label
                ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                : "border-[#e6e6e6] text-[#0c0c0c]"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <AddToCartButton
          productId={product.id}
          size={size}
          label="В корзину"
          compact
        />
      </div>
    </div>
  );
}
