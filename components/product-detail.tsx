"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion } from "@/components/accordion";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductLightbox } from "@/components/product-lightbox";
import { PAGE_X, STICKY_TOP_DESKTOP } from "@/lib/ui";
import { formatPrice, type Product, type ProductSize } from "@/lib/products";

type ProductDetailProps = {
  product: Product;
};

function SizeChart({ sizes }: { sizes: ProductSize[] }) {
  const columns = [
    { key: "label", label: "Размер" },
    { key: "length", label: "Длина" },
    { key: "shoulder", label: "Плечо" },
    { key: "chest", label: "Грудь" },
    { key: "sleeve", label: "Рукав" },
  ] as const;

  return (
    <div className="w-full overflow-x-auto pt-1">
      <div className="min-w-[480px]">
        <div className="grid w-full grid-cols-5 gap-3 border-b border-[#e6e6e6] pb-4 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase sm:gap-4">
          {columns.map((column) => (
            <span key={column.key}>{column.label}</span>
          ))}
        </div>

        {sizes.map((size) => (
          <div
            key={size.label}
            className="grid w-full grid-cols-5 gap-3 border-b border-[#f0f0f0] py-5 text-[14px] leading-[1.2] text-[#0c0c0c] last:border-b-0 sm:gap-4"
          >
            <span className="font-medium uppercase">{size.label}</span>
            <span>{size.length}</span>
            <span>{size.shoulder}</span>
            <span>{size.chest}</span>
            <span>{size.sleeve}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type LightboxState = {
  index: number;
  rect: DOMRect;
  sourceImage: HTMLImageElement;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((size) => size.label === "M")?.label ??
      product.sizes[0]?.label ??
      "",
  );
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileMainRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);

  const openLightbox = useCallback((index: number, element: HTMLDivElement) => {
    const sourceImage = element.querySelector("img");
    if (!sourceImage) return;

    setLightbox({
      index,
      rect: element.getBoundingClientRect(),
      sourceImage,
    });
  }, []);

  const scrollToImage = useCallback((index: number) => {
    const target = imageRefs.current[index];
    if (!target) return;

    scrollingRef.current = true;
    setActiveImage(index);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      scrollingRef.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const nodes = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible[0]) return;
        const index = Number(visible[0].target.getAttribute("data-index"));
        if (!Number.isNaN(index)) setActiveImage(index);
      },
      {
        root: null,
        rootMargin: `-${STICKY_TOP_DESKTOP}px 0px -40% 0px`,
        threshold: [0.35, 0.6, 0.85],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [product.images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const { sourceImage } = lightbox;
    const previousOpacity = sourceImage.style.opacity;
    sourceImage.style.opacity = "0";
    return () => {
      sourceImage.style.opacity = previousOpacity;
    };
  }, [lightbox]);

  const addToCartButton = (
    <AddToCartButton productId={product.id} size={selectedSize} />
  );

  return (
    <div className="bg-white pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-20">
      <div className={`${PAGE_X} pt-5 pb-4`}>
        <a
          href="/catalog"
          className="text-[13px] leading-[1.2] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
        >
          ← Вернуться к каталогу
        </a>
      </div>

      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-[80px_minmax(280px,640px)_minmax(0,1fr)] md:gap-x-10 md:gap-y-10 ${PAGE_X}`}
      >
        <aside
          className="sticky hidden self-start md:block"
          style={{ top: STICKY_TOP_DESKTOP }}
        >
          <div className="flex flex-col gap-3">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => scrollToImage(index)}
                className={`relative aspect-square w-[80px] overflow-hidden border bg-white transition-colors duration-300 ${
                  activeImage === index
                    ? "border-[#0c0c0c]"
                    : "border-[#e6e6e6] hover:border-[#8d8d8d]"
                }`}
                aria-label={`Фото ${index + 1}`}
                aria-current={activeImage === index ? "true" : undefined}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                  quality={85}
                />
              </button>
            ))}
          </div>
        </aside>

        <div className="w-full">
          <div className="md:hidden">
            <div
              ref={mobileMainRef}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (mobileMainRef.current) {
                  openLightbox(activeImage, mobileMainRef.current);
                }
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (mobileMainRef.current) {
                  openLightbox(activeImage, mobileMainRef.current);
                }
              }}
              className="relative aspect-square w-full cursor-zoom-in bg-white"
            >
              <Image
                src={product.images[activeImage]}
                alt={`${product.name} — фото ${activeImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-contain"
                quality={90}
                priority
              />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
                <button
                  key={`mobile-thumb-${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative size-14 shrink-0 overflow-hidden border bg-white transition-colors ${
                    activeImage === index
                      ? "border-[#0c0c0c]"
                      : "border-[#e6e6e6]"
                  }`}
                  aria-label={`Фото ${index + 1}`}
                  aria-current={activeImage === index ? "true" : undefined}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-0.5"
                    quality={85}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden flex-col gap-10 md:flex">
            {product.images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                id={`product-image-${index}`}
                data-index={index}
                ref={(node) => {
                  imageRefs.current[index] = node;
                }}
                role="button"
                tabIndex={0}
                onClick={() => {
                  const node = imageRefs.current[index];
                  if (node) openLightbox(index, node);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  const node = imageRefs.current[index];
                  if (node) openLightbox(index, node);
                }}
                className="relative aspect-square w-full cursor-zoom-in scroll-mt-[108px] bg-white"
              >
                <Image
                  src={image}
                  alt={`${product.name} — фото ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-contain"
                  quality={90}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="min-w-0 md:sticky md:self-start" style={{ top: STICKY_TOP_DESKTOP }}>
          <nav
            aria-label="Хлебные крошки"
            className="mb-5 w-full text-[12px] leading-[1.4] text-[#8d8d8d] uppercase"
          >
            <a href="/" className="transition-colors hover:text-[#0c0c0c]">
              Главная
            </a>
            <span className="mx-2">/</span>
            <a
              href={`/catalog?category=${product.category}`}
              className="transition-colors hover:text-[#0c0c0c]"
            >
              {product.categoryLabel}
            </a>
            <span className="mx-2">/</span>
            <span className="text-[#0c0c0c]">{product.name}</span>
          </nav>

          <h1 className="w-full text-[18px] leading-[1.25] font-medium text-[#0c0c0c] uppercase">
            {product.name}
          </h1>
          <p className="mt-2 w-full text-[15px] leading-[1.3] text-[#8d8d8d] uppercase">
            {product.manual}
          </p>
          <p className="mt-4 w-full text-[14px] leading-[1.3] text-[#8d8d8d]">
            Артикул: {product.sku}
          </p>
          <p className="mt-2 w-full text-[16px] leading-[1.2] text-[#0c0c0c]">
            {formatPrice(product.price)}
          </p>

          <div className="mt-8 w-full">
            <p className="text-[16px] leading-[1.2] text-[#0c0c0c] uppercase">
              Цвет
            </p>
            <div className="mt-3 flex w-full items-center gap-4 border border-[#e6e6e6] px-3 py-3">
              <div className="relative aspect-square w-[64px] shrink-0 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.color}
                  fill
                  sizes="64px"
                  className="object-contain"
                  quality={85}
                />
              </div>
              <span className="text-[15px] leading-[1.2] text-[#0c0c0c] uppercase">
                {product.color}
              </span>
            </div>
          </div>

          <div className="mt-8 w-full">
            <p className="text-[16px] leading-[1.2] text-[#0c0c0c] uppercase">
              Размер
            </p>
            <div className="mt-3 flex w-full gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={`flex h-[48px] min-w-[48px] flex-1 items-center justify-center border px-4 text-[16px] leading-none transition-colors ${
                    selectedSize === size.label
                      ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                      : "border-[#e6e6e6] text-[#0c0c0c] hover:border-[#0c0c0c]"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 hidden w-full gap-2.5 md:flex">
            {addToCartButton}
            <FavoriteButton
              productId={product.id}
              className="flex h-[45px] w-[45px] shrink-0 items-center justify-center border border-[#e6e6e6] bg-white transition-colors hover:border-[#0c0c0c]"
              iconClassName="brightness-0"
              activeClassName="border-[#0c0c0c] bg-[#0c0c0c]"
            />
          </div>

          {product.otherColors ? (
            <div className="mt-4 w-full border border-[#e6e6e6] px-4 py-3.5 text-[14px] leading-[1.3] text-[#0c0c0c]">
              Другие цвета: {product.otherColors}
            </div>
          ) : null}

          <div className="mt-10 w-full border-b border-[#e6e6e6]">
            <Accordion title="Размерная сетка">
              <SizeChart sizes={product.sizes} />
            </Accordion>

            <Accordion title="Состав">
              <p className="w-full text-[15px] leading-[1.6] text-[#0c0c0c]">
                {product.composition}
              </p>
            </Accordion>

            <Accordion title="Оплата и доставка">
              <p className="w-full text-[15px] leading-[1.6] text-[#0c0c0c]">
                {product.paymentDelivery}
              </p>
            </Accordion>
          </div>
        </aside>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#e6e6e6] bg-white py-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden ${PAGE_X}`}
      >
        <div className="flex gap-2.5">
          {addToCartButton}
          <FavoriteButton
            productId={product.id}
            className="flex h-[45px] w-[45px] shrink-0 items-center justify-center border border-[#e6e6e6] bg-white"
            iconClassName="brightness-0"
            activeClassName="border-[#0c0c0c] bg-[#0c0c0c]"
          />
        </div>
      </div>

      {lightbox ? (
        <ProductLightbox
          sourceImage={lightbox.sourceImage}
          alt={`${product.name} — фото ${lightbox.index + 1}`}
          originRect={lightbox.rect}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </div>
  );
}
