"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CatalogProductCard } from "@/components/catalog-product-card";
import {
  catalogCategories,
  catalogSizes,
  expandCatalogProducts,
  filterCatalogProducts,
  sortCatalogProducts,
  sortOptions,
  type CatalogCategoryId,
  type CatalogSize,
  type SortOption,
} from "@/lib/catalog";
import { getAllProducts } from "@/lib/products";
import { PAGE_X } from "@/lib/ui";

function SortIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 3v10M8 13l-3-3M8 13l3-3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseCategory(value: string | null): CatalogCategoryId {
  const match = catalogCategories.find((item) => item.id === value);
  return match?.id ?? "all";
}

function parseSize(value: string | null): CatalogSize | null {
  if (!value) return null;
  return catalogSizes.includes(value as CatalogSize)
    ? (value as CatalogSize)
    : null;
}

function parseSort(value: string | null): SortOption {
  const match = sortOptions.find((item) => item.id === value);
  return match?.id ?? "default";
}

export function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortRef = useRef<HTMLDivElement>(null);

  const category = parseCategory(searchParams.get("category"));
  const size = parseSize(searchParams.get("size"));
  const sort = parseSort(searchParams.get("sort"));

  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const products = useMemo(() => {
    const filtered = filterCatalogProducts(getAllProducts(), { category, size });
    const sorted = sortCatalogProducts(filtered, sort);
    return expandCatalogProducts(sorted, 4);
  }, [category, size, sort]);

  const activeCategoryLabel =
    catalogCategories.find((item) => item.id === category)?.label ?? "КАТАЛОГ";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "default")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(query ? `/catalog?${query}` : "/catalog", { scroll: false });
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    if (sortOpen) {
      window.addEventListener("pointerdown", onPointerDown);
    }

    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [sortOpen]);

  const currentSortLabel =
    sortOptions.find((item) => item.id === sort)?.label ?? "По умолчанию";

  const sidebar = (
  <>
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
      {catalogCategories.map((item) => {
        const active = category === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              updateParams({ category: item.id });
              setMobileFiltersOpen(false);
            }}
            className={`shrink-0 text-left text-[12px] leading-[1.2] uppercase transition-colors sm:text-[13px] ${
              active
                ? "font-medium text-[#0c0c0c]"
                : "text-[#8d8d8d] hover:text-[#0c0c0c]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>

    <div className="mt-6 border-t border-[#e6e6e6] pt-6 lg:mt-8">
      <p className="mb-3 text-[12px] leading-none text-[#8d8d8d] uppercase">
        Размер
      </p>
      <div className="flex flex-wrap gap-2">
        {catalogSizes.map((item) => {
          const active = size === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                updateParams({ size: active ? null : item });
                setMobileFiltersOpen(false);
              }}
              className={`flex h-9 min-w-9 items-center justify-center border px-2.5 text-[12px] leading-none uppercase transition-colors ${
                active
                  ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                  : "border-[#e6e6e6] text-[#0c0c0c] hover:border-[#0c0c0c]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  </>
  );

  return (
    <div className="bg-white pb-16">
      <div
        className={`flex items-center justify-between gap-3 border-b border-[#e6e6e6] py-4 ${PAGE_X}`}
      >
        <nav
          aria-label="Хлебные крошки"
          className="min-w-0 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase"
        >
          <a href="/" className="transition-colors hover:text-[#0c0c0c]">
            Главная
          </a>
          <span className="mx-2">—</span>
          <span className="text-[#0c0c0c]">Каталог</span>
        </nav>

        <div ref={sortRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            className="flex items-center gap-2 text-[12px] leading-none text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
          >
            <SortIcon className="size-4" />
            <span className="hidden sm:inline">Сортировать</span>
            <span className="sm:hidden">{currentSortLabel}</span>
            <ChevronIcon
              className={`size-3 transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>

          {sortOpen ? (
            <div className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[200px] border border-[#e6e6e6] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    updateParams({ sort: option.id });
                    setSortOpen(false);
                  }}
                  className={`block w-full border-b border-[#f0f0f0] px-4 py-3 text-left text-[12px] leading-none uppercase transition-colors last:border-b-0 hover:bg-[#fafafa] ${
                    sort === option.id ? "text-[#0c0c0c]" : "text-[#8d8d8d]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={`lg:hidden ${PAGE_X}`}>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((value) => !value)}
          className="flex w-full items-center justify-between border-b border-[#e6e6e6] py-4 text-[12px] leading-none text-[#0c0c0c] uppercase"
        >
          <span>Фильтры</span>
          <ChevronIcon
            className={`size-3 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
          />
        </button>

        {mobileFiltersOpen ? (
          <div className="border-b border-[#e6e6e6] py-5">{sidebar}</div>
        ) : null}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] ${PAGE_X}`}>
        <aside className="hidden border-r border-[#e6e6e6] py-8 pr-8 lg:sticky lg:top-[76px] lg:block lg:max-h-[calc(100svh-76px)] lg:self-start lg:overflow-y-auto">
          {sidebar}
        </aside>

        <section className="py-6 lg:pl-8 lg:py-8">
          <div className="mb-5 flex items-end justify-between gap-4 lg:hidden">
            <h1 className="text-[18px] leading-[1.15] font-medium text-[#0c0c0c] uppercase">
              {activeCategoryLabel}
            </h1>
            <p className="text-[12px] leading-none text-[#8d8d8d] uppercase">
              {products.length} товаров
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-[2px] gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <CatalogProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center border border-[#e6e6e6] px-6 text-center">
              <p className="text-[14px] leading-[1.4] font-medium text-[#0c0c0c] uppercase">
                Ничего не найдено
              </p>
              <p className="mt-2 max-w-[320px] text-[13px] leading-[1.5] text-[#8d8d8d]">
                Попробуйте изменить категорию или размер, либо посмотрите весь
                каталог.
              </p>
              <button
                type="button"
                onClick={() => router.replace("/catalog", { scroll: false })}
                className="mt-5 h-10 bg-[#0c0c0c] px-5 text-[12px] leading-none text-white uppercase transition-opacity hover:opacity-80"
              >
                Смотреть всё
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
