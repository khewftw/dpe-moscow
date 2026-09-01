"use client";

import { useCart } from "@/components/cart-provider";

type FavoriteButtonProps = {
  productId: string;
  className?: string;
  iconClassName?: string;
  activeClassName?: string;
};

export function FavoriteButton({
  productId,
  className = "flex size-9 items-center justify-center border border-[#e6e6e6] bg-white transition-colors hover:border-[#0c0c0c]",
  iconClassName = "",
  activeClassName = "border-[#0c0c0c] bg-[#0c0c0c]",
}: FavoriteButtonProps) {
  const { isInWishlist, toggleWishlist } = useCart();
  const active = isInWishlist(productId);

  return (
    <button
      type="button"
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={active}
      className={`${className} ${active ? activeClassName : ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(productId);
      }}
    >
      <img
        src="/icons/heart.svg"
        alt=""
        width={16}
        height={16}
        className={`${iconClassName} ${active ? "invert" : ""}`}
      />
    </button>
  );
}
