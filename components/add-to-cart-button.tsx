"use client";

import { getCartLineKey, useCart } from "@/components/cart-provider";
import { RollingNumber } from "@/components/rolling-number";
import { useCallback, useMemo, useState } from "react";

type AddToCartButtonProps = {
  productId: string;
  size: string;
  label?: string;
  className?: string;
  compact?: boolean;
};

export function AddToCartButton({
  productId,
  size,
  label = "Добавить в корзину",
  className = "",
  compact = false,
}: AddToCartButtonProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [pendingActive, setPendingActive] = useState(false);

  const lineKey = getCartLineKey(productId, size);
  const cartQuantity = useMemo(
    () =>
      items.find(
        (item) => getCartLineKey(item.productId, item.size) === lineKey,
      )?.quantity ?? 0,
    [items, lineKey],
  );

  const isActive = cartQuantity > 0 || pendingActive;
  const displayQuantity = cartQuantity > 0 ? cartQuantity : 1;

  const handleAdd = useCallback(() => {
    if (cartQuantity > 0) return;
    setPendingActive(true);
    addToCart(productId, size, 1);
  }, [addToCart, cartQuantity, productId, size]);

  const handleDecrease = useCallback(() => {
    if (cartQuantity <= 0) return;
    updateQuantity(lineKey, cartQuantity - 1);
    if (cartQuantity <= 1) setPendingActive(false);
  }, [cartQuantity, lineKey, updateQuantity]);

  const handleIncrease = useCallback(() => {
    if (cartQuantity <= 0) {
      addToCart(productId, size, 1);
      return;
    }
    updateQuantity(lineKey, Math.min(99, cartQuantity + 1));
  }, [addToCart, cartQuantity, lineKey, productId, size, updateQuantity]);

  const heightClass = compact ? "h-10" : "h-[45px]";
  const textClass = compact
    ? "text-[12px] leading-none"
    : "text-[14px] leading-none";
  const controlButtonClass = compact
    ? "flex size-8 shrink-0 items-center justify-center text-[18px] leading-none transition-colors hover:bg-[#f5f5f5]"
    : "flex size-10 shrink-0 items-center justify-center text-[20px] leading-none transition-colors hover:bg-[#f5f5f5]";

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={`${heightClass} flex-1 bg-[#0c0c0c] ${textClass} font-normal text-white uppercase transition-[background-color,border-color,color,box-shadow] duration-300 ease-out hover:opacity-80 ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className={`add-to-cart-active ${heightClass} flex flex-1 items-center justify-between border border-[#e6e6e6] bg-white px-1 text-[#0c0c0c] shadow-[0_0_0_0_rgba(12,12,12,0)] transition-[border-color,box-shadow,background-color] duration-300 ease-out ${className}`}
      role="group"
      aria-label="Количество в корзине"
    >
      <button
        type="button"
        aria-label="Уменьшить количество"
        className={controlButtonClass}
        onClick={handleDecrease}
      >
        −
      </button>
      <RollingNumber
        value={displayQuantity}
        className={`${textClass} font-medium`}
      />
      <button
        type="button"
        aria-label="Увеличить количество"
        className={controlButtonClass}
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
}
