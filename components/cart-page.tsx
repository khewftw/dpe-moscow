"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getCartLineKey, useCart } from "@/components/cart-provider";
import { FavoriteButton } from "@/components/favorite-button";
import { QuantityControl } from "@/components/quantity-control";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart";
import { formatPrice, getProductById } from "@/lib/products";
import { PAGE_X } from "@/lib/ui";

function CartLineItem({
  lineKey,
  productId,
  size,
  quantity,
}: {
  lineKey: string;
  productId: string;
  size: string;
  quantity: number;
}) {
  const { updateQuantity, updateSize, removeFromCart } = useCart();
  const product = getProductById(productId);

  if (!product) return null;

  const lineTotal = product.price * quantity;

  return (
    <article className="grid grid-cols-1 gap-5 border-b border-[#e6e6e6] py-6 sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <a
        href={`/catalog/${product.id}`}
        className="relative aspect-square w-full max-w-[240px] overflow-hidden bg-white sm:max-w-none"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 180px, 240px"
          className="object-contain"
          quality={90}
        />
      </a>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <a
              href={`/catalog/${product.id}`}
              className="text-[16px] leading-[1.25] font-medium text-[#0c0c0c] uppercase transition-opacity hover:opacity-60 sm:text-[18px]"
            >
              {product.name}
            </a>
            <p className="mt-1 text-[13px] leading-[1.3] text-[#8d8d8d] uppercase">
              {product.manual}
            </p>
          </div>
          <FavoriteButton
            productId={product.id}
            className="flex size-10 shrink-0 items-center justify-center border border-[#e6e6e6] bg-white transition-colors hover:border-[#0c0c0c]"
          />
        </div>

        <dl className="mt-5 grid gap-2 text-[13px] leading-[1.4] uppercase sm:grid-cols-2">
          <div>
            <dt className="text-[#8d8d8d]">Артикул</dt>
            <dd className="mt-0.5 text-[#0c0c0c]">{product.sku}</dd>
          </div>
          <div>
            <dt className="text-[#8d8d8d]">Цвет</dt>
            <dd className="mt-0.5 text-[#0c0c0c]">{product.color}</dd>
          </div>
          <div>
            <dt className="text-[#8d8d8d]">Категория</dt>
            <dd className="mt-0.5 text-[#0c0c0c]">{product.categoryLabel}</dd>
          </div>
          <div>
            <dt className="text-[#8d8d8d]">Цена</dt>
            <dd className="mt-0.5 font-[Arial,Helvetica,sans-serif] normal-case text-[#0c0c0c]">
              {formatPrice(product.price)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <p className="text-[12px] leading-none text-[#8d8d8d] uppercase">
            Размер
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((entry) => (
              <button
                key={entry.label}
                type="button"
                onClick={() => updateSize(lineKey, entry.label)}
                className={`flex h-9 min-w-9 items-center justify-center border px-2.5 text-[12px] leading-none uppercase transition-colors ${
                  size === entry.label
                    ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                    : "border-[#e6e6e6] text-[#0c0c0c] hover:border-[#0c0c0c]"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-[12px] leading-none text-[#8d8d8d] uppercase">
              Количество
            </p>
            <QuantityControl
              value={quantity}
              onChange={(value) => updateQuantity(lineKey, value)}
            />
          </div>

          <div className="text-right">
            <p className="text-[12px] leading-none text-[#8d8d8d] uppercase">
              Сумма
            </p>
            <p className="mt-1 font-[Arial,Helvetica,sans-serif] text-[18px] leading-none text-[#0c0c0c]">
              {formatPrice(lineTotal)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(lineKey)}
          className="mt-5 text-[12px] leading-none text-[#8d8d8d] uppercase underline-offset-4 transition-colors hover:text-[#0c0c0c] hover:underline"
        >
          Удалить из корзины
        </button>
      </div>
    </article>
  );
}

function WishlistItem({ productId }: { productId: string }) {
  const { removeFromWishlist } = useCart();
  const product = getProductById(productId);
  const [size, setSize] = useState(
    product?.sizes.find((entry) => entry.label === "M")?.label ??
      product?.sizes[0]?.label ??
      "",
  );

  if (!product) return null;

  return (
    <article className="border border-[#e6e6e6] bg-white">
      <a href={`/catalog/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-contain p-4"
            quality={90}
          />
        </div>
      </a>

      <div className="border-t border-[#e6e6e6] p-4">
        <a
          href={`/catalog/${product.id}`}
          className="text-[13px] leading-[1.25] font-medium text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
        >
          {product.name}
        </a>
        <p className="mt-1 font-[Arial,Helvetica,sans-serif] text-[14px] leading-none text-[#0c0c0c]">
          {formatPrice(product.price)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((entry) => (
            <button
              key={entry.label}
              type="button"
              onClick={() => setSize(entry.label)}
              className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[11px] leading-none uppercase ${
                size === entry.label
                  ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                  : "border-[#e6e6e6] text-[#0c0c0c]"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <AddToCartButton
            productId={product.id}
            size={size}
            label="В корзину"
            compact
          />
          <button
            type="button"
            onClick={() => removeFromWishlist(product.id)}
            className="flex h-10 w-10 items-center justify-center border border-[#e6e6e6] transition-colors hover:border-[#0c0c0c]"
            aria-label="Удалить из избранного"
          >
            <img
              src="/icons/heart.svg"
              alt=""
              width={16}
              height={16}
              className="brightness-0"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CartPageContent() {
  const { ready, items, wishlist, cartCount, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  useEffect(() => {
    if (window.location.hash === "#wishlist") {
      document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ready]);

  const deliveryLeft = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const hasFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;
    setSubmitted(true);
    clearCart();
  };

  if (!ready) {
    return (
      <div className={`py-16 ${PAGE_X}`}>
        <p className="text-[14px] text-[#8d8d8d] uppercase">Загрузка корзины...</p>
      </div>
    );
  }

  return (
    <div className={`pb-16 ${PAGE_X}`}>
      <div className="border-b border-[#e6e6e6] py-6">
        <nav
          aria-label="Хлебные крошки"
          className="text-[12px] leading-[1.2] text-[#8d8d8d] uppercase"
        >
          <a href="/" className="transition-colors hover:text-[#0c0c0c]">
            Главная
          </a>
          <span className="mx-2">—</span>
          <span className="text-[#0c0c0c]">Корзина</span>
        </nav>
        <h1 className="mt-4 text-[20px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[24px]">
          Корзина
          {cartCount > 0 ? (
            <span className="ml-2 text-[#8d8d8d]">{cartCount}</span>
          ) : null}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <section>
          {items.length > 0 ? (
            items.map((item) => {
              const lineKey = getCartLineKey(item.productId, item.size);
              return (
                <CartLineItem
                  key={lineKey}
                  lineKey={lineKey}
                  productId={item.productId}
                  size={item.size}
                  quantity={item.quantity}
                />
              );
            })
          ) : submitted ? (
            <div className="border border-[#e6e6e6] px-6 py-12 text-center">
              <p className="text-[16px] font-medium text-[#0c0c0c] uppercase">
                Заказ оформлен
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#8d8d8d]">
                Спасибо! Мы свяжемся с вами в ближайшее время для подтверждения
                заказа.
              </p>
              <a
                href="/catalog"
                className="mt-6 inline-flex h-11 items-center bg-[#0c0c0c] px-6 text-[12px] leading-none text-white uppercase"
              >
                В каталог
              </a>
            </div>
          ) : (
            <div className="border border-[#e6e6e6] px-6 py-12 text-center">
              <p className="text-[16px] font-medium text-[#0c0c0c] uppercase">
                Корзина пуста
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#8d8d8d]">
                Добавьте товары из каталога или перенесите их из избранного.
              </p>
              <a
                href="/catalog"
                className="mt-6 inline-flex h-11 items-center bg-[#0c0c0c] px-6 text-[12px] leading-none text-white uppercase"
              >
                Перейти в каталог
              </a>
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-[92px] lg:self-start">
          <div className="border border-[#e6e6e6] p-5 sm:p-6">
            <h2 className="text-[14px] leading-none font-medium text-[#0c0c0c] uppercase">
              Ваш заказ
            </h2>

            <div className="mt-5 space-y-3 border-b border-[#e6e6e6] pb-5 text-[13px] leading-[1.4] uppercase">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#8d8d8d]">Товары</span>
                <span className="font-[Arial,Helvetica,sans-serif] normal-case text-[#0c0c0c]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#8d8d8d]">Доставка</span>
                <span className="text-[#0c0c0c]">
                  {hasFreeDelivery ? "Бесплатно" : "Рассчитывается"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-[14px] font-medium text-[#0c0c0c] uppercase">
                Итого
              </span>
              <span className="font-[Arial,Helvetica,sans-serif] text-[20px] leading-none text-[#0c0c0c]">
                {formatPrice(subtotal)}
              </span>
            </div>

            {!hasFreeDelivery && subtotal > 0 ? (
              <p className="mt-4 text-[12px] leading-[1.5] text-[#8d8d8d] uppercase">
                До бесплатной доставки осталось{" "}
                <span className="text-[#0c0c0c]">
                  {formatPrice(deliveryLeft)}
                </span>
              </p>
            ) : null}

            {submitted ? null : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-[12px] leading-none text-[#8d8d8d] uppercase">
                    Имя
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full border border-[#e6e6e6] bg-white px-3 text-[14px] outline-none focus:border-[#0c0c0c]"
                  />
                </div>
                <div>
                  <label className="text-[12px] leading-none text-[#8d8d8d] uppercase">
                    Телефон
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full border border-[#e6e6e6] bg-white px-3 text-[14px] outline-none focus:border-[#0c0c0c]"
                  />
                </div>
                <div>
                  <label className="text-[12px] leading-none text-[#8d8d8d] uppercase">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full border border-[#e6e6e6] bg-white px-3 text-[14px] outline-none focus:border-[#0c0c0c]"
                  />
                </div>
                <div>
                  <label className="text-[12px] leading-none text-[#8d8d8d] uppercase">
                    Комментарий
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        comment: event.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-2 w-full border border-[#e6e6e6] bg-white px-3 py-2 text-[14px] outline-none focus:border-[#0c0c0c]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!items.length}
                  className="h-12 w-full bg-[#0c0c0c] text-[13px] leading-none text-white uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Оформить заказ
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      <section id="wishlist" className="mt-16 border-t border-[#e6e6e6] pt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[18px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[20px]">
              Избранное
            </h2>
            <p className="mt-2 max-w-[520px] text-[13px] leading-[1.5] text-[#8d8d8d] uppercase">
              Сохраняйте понравившиеся вещи и добавляйте их в корзину одним
              кликом.
            </p>
          </div>
          {wishlist.length > 0 ? (
            <span className="text-[12px] leading-none text-[#8d8d8d] uppercase">
              {wishlist.length} товаров
            </span>
          ) : null}
        </div>

        {wishlist.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-[2px] md:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((productId) => (
              <WishlistItem key={productId} productId={productId} />
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-[#e6e6e6] px-6 py-10 text-center">
            <p className="text-[14px] text-[#8d8d8d] uppercase">
              Пока ничего нет — нажмите на сердечко у товара
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
