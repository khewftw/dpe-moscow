"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { searchProducts } from "@/lib/products";

type HeaderSearchProps = {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

export function HeaderSearch({
  expanded,
  onExpand,
  onCollapse,
}: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const results = query.trim().length > 1 ? searchProducts(query) : [];

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
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

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div
        className={`flex h-9 items-center border transition-colors ${
          expanded
            ? "border-[#0c0c0c] bg-white"
            : "border-[#e6e6e6] bg-[#fafafa]"
        }`}
      >
        <button
          type="button"
          onClick={onExpand}
          className="flex size-9 shrink-0 items-center justify-center"
          aria-label="Поиск"
        >
          <img src="/icons/search.svg" alt="" width={16} height={16} />
        </button>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={onExpand}
          placeholder="Поиск"
          className={`min-w-0 flex-1 bg-transparent pr-3 text-[12px] leading-none uppercase outline-none placeholder:text-[#8d8d8d] ${
            expanded ? "block" : "hidden lg:block"
          }`}
        />
      </div>

      {expanded && results.length > 0 ? (
        <div className="absolute top-[calc(100%+4px)] right-0 left-0 z-50 border border-[#e6e6e6] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          {results.map((product) => (
            <a
              key={product.id}
              href={`/catalog/${product.id}`}
              className="flex items-center gap-3 border-b border-[#f0f0f0] px-3 py-2.5 last:border-b-0 hover:bg-[#fafafa]"
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
                <p className="truncate text-[12px] leading-[1.2] text-[#0c0c0c] uppercase">
                  {product.name}
                </p>
                <p className="text-[11px] leading-[1.2] text-[#8d8d8d] uppercase">
                  {product.manual}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
