"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InstagramCard } from "@/components/instagram-card";
import { socialPosts } from "@/lib/social-posts";
import { PAGE_X } from "@/lib/ui";

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Назад" : "Вперёд"}
      className="flex size-9 items-center justify-center rounded-full border border-[#0c0c0c] bg-[#0c0c0c] text-white transition-opacity hover:opacity-70"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
        {direction === "left" ? (
          <path
            d="M10 3.5L5.5 8L10 12.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3.5L10.5 8L6 12.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export function SocialProof() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const max = viewport.scrollWidth - viewport.clientWidth;
    setProgress(max > 0 ? viewport.scrollLeft / max : 0);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const card = viewport.querySelector("article");
    const gap = 12;
    const amount = card
      ? card.getBoundingClientRect().width + gap
      : viewport.clientWidth * 0.8;

    viewport.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateProgress();
    viewport.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      viewport.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  return (
    <section className="bg-white pb-14 sm:pb-20">
      <div
        className={`flex items-center justify-between gap-4 pt-14 sm:pt-20 ${PAGE_X}`}
      >
        <h2 className="text-[18px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[20px]">
          Нас выбирают
        </h2>

        <div className="flex items-center gap-2">
          <ArrowButton direction="left" onClick={() => scrollBy("left")} />
          <ArrowButton direction="right" onClick={() => scrollBy("right")} />
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mt-5 flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x pan-y",
        }}
      >
        {socialPosts.map((post) => (
          <InstagramCard key={post.id} post={post} />
        ))}
      </div>

      <div className={`mt-4 ${PAGE_X}`}>
        <div className="h-px w-full bg-[#e6e6e6]">
          <div
            className="h-px bg-[#0c0c0c] transition-[width] duration-200"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
