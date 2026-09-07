"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchProducts } from "@/lib/products";

type HeaderSearchProps = {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M7 3C6.20888 3 5.43552 3.2346 4.77772 3.67412C4.11992 4.11365 3.60723 4.73836 3.30448 5.46927C3.00173 6.20017 2.92252 7.00444 3.07686 7.78036C3.2312 8.55628 3.61216 9.26902 4.17157 9.82843C4.73098 10.3878 5.44372 10.7688 6.21964 10.9231C6.99556 11.0775 7.79983 10.9983 8.53073 10.6955C9.26164 10.3928 9.88635 9.88008 10.3259 9.22228C10.7654 8.56448 11 7.79112 11 7C10.9999 5.93915 10.5785 4.92178 9.82835 4.17165C9.07822 3.42152 8.06085 3.00007 7 3Z"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeMiterlimit="10" />
    </svg>
  );
}

export function HeaderSearch({
  expanded,
  onExpand,
  onCollapse,
}: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const results = query.trim().length > 1 ? searchProducts(query) : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
    else setQuery("");
  }, [expanded]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onCollapse();
    };

    if (expanded) {
      window.addEventListener("pointerdown", onPointerDown);
    }

    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [expanded, onCollapse]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCollapse();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, onCollapse]);

  return (
    <div>
      <button
        type="button"
        onClick={() => (expanded ? onCollapse() : onExpand())}
        className="flex size-9 items-center justify-center transition-opacity hover:opacity-60"
        aria-label="Поиск"
        aria-expanded={expanded}
      >
        <SearchIcon className="size-4" />
      </button>

      {mounted && expanded
        ? createPortal(
            <div
              ref={rootRef}
              className="fixed right-4 z-[90] w-[min(320px,calc(100vw-32px))] border border-[#e6e6e6] bg-white text-[#0c0c0c] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
              style={{ top: "var(--search-top, 76px)" }}
            >
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ПОИСК"
                className="h-11 w-full bg-transparent px-3 text-[12px] leading-none tracking-[0.14em] uppercase outline-none placeholder:text-[#8d8d8d]"
              />

              {results.length > 0 ? (
                <div className="border-t border-[#e6e6e6]">
                  {results.map((product) => (
                    <a
                      key={product.id}
                      href={`/catalog/${product.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa]"
                      onClick={onCollapse}
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden bg-[#f7f7f7]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] leading-[1.2] tracking-[0.12em] text-[#0c0c0c] uppercase">
                          {product.name}
                        </p>
                        <p className="text-[11px] leading-[1.2] tracking-[0.08em] text-[#8d8d8d] uppercase">
                          {product.manual}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
