"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

const SETS = 3;
const SPEED = 52;
const HOVER_SPEED_FACTOR = 0.4;
const DRAG_THRESHOLD = 8;

function wrapX(x: number, loop: number) {
  if (!loop) return 0;
  let next = x % loop;
  if (next > 0) next -= loop;
  if (next <= -loop) next += loop;
  return next;
}

function MobileProductStrip({ products }: { products: Product[] }) {
  return (
    <div
      className="mt-5 overflow-x-auto overscroll-x-contain scroll-smooth pl-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y" }}
    >
      <div
        className="flex w-max gap-[2px] pr-5"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className="snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSlider({ products }: { products: Product[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverCount = useRef(0);
  const [useNativeScroll, setUseNativeScroll] = useState(false);
  const items = Array.from({ length: SETS }, () => products).flat();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setUseNativeScroll(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (useNativeScroll) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const state = {
      x: 0,
      loop: 0,
      dragging: false,
      pending: false,
      pointer: 0,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastT: 0,
      vel: 0,
      coast: 0,
      moved: 0,
      ignoreClick: false,
      paused: false,
    };

    const measure = () => {
      state.loop = track.scrollWidth / SETS;
    };

    const apply = () => {
      measure();
      state.x = wrapX(state.x, state.loop);
      gsap.set(track, { x: state.x });
    };

    measure();
    apply();

    const tick = (_time: number, delta: number) => {
      if (state.dragging) return;

      if (!state.paused && Math.abs(state.coast) > 0.04) {
        state.x += state.coast * (delta / 16.67);
        state.coast *= Math.pow(0.92, delta / 16.67);
        if (Math.abs(state.coast) < 0.04) state.coast = 0;
        apply();
        return;
      }

      if (reduced) return;
      if (state.paused) return;

      const speed =
        hoverCount.current > 0 ? SPEED * HOVER_SPEED_FACTOR : SPEED;
      state.x -= speed * (delta / 1000);
      apply();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      state.pending = true;
      state.dragging = false;
      state.coast = 0;
      state.vel = 0;
      state.moved = 0;
      state.ignoreClick = false;
      state.paused = true;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.lastX = event.clientX;
      state.lastT = performance.now();
      state.pointer = event.pointerId;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== state.pointer) return;
      if (!state.pending && !state.dragging) return;

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      if (state.pending && !state.dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
          return;
        }

        if (Math.abs(dy) > Math.abs(dx)) {
          state.pending = false;
          state.paused = false;
          return;
        }

        state.pending = false;
        state.dragging = true;
        viewport.setPointerCapture(event.pointerId);
        viewport.style.cursor = "grabbing";
        event.preventDefault();
      }

      if (!state.dragging) return;

      const now = performance.now();
      const step = event.clientX - state.lastX;
      const dt = now - state.lastT;
      state.x += step;
      state.moved += Math.abs(step);
      state.vel = dt > 0 ? step / dt : 0;
      state.lastX = event.clientX;
      state.lastT = now;
      apply();
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== state.pointer) return;

      const wasDragging = state.dragging;
      state.pending = false;
      state.dragging = false;
      state.paused = false;

      if (wasDragging) {
        state.coast = state.vel * 16.67;
        if (state.moved > DRAG_THRESHOLD) state.ignoreClick = true;
        viewport.style.cursor = "";
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId);
        }
      }
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!state.ignoreClick) return;
      event.preventDefault();
      event.stopPropagation();
      state.ignoreClick = false;
    };

    const onResize = () => apply();

    gsap.ticker.add(tick);
    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", onClickCapture, true);
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("resize", onResize);
    };
  }, [products, useNativeScroll]);

  if (useNativeScroll) {
    return <MobileProductStrip products={products} />;
  }

  return (
    <div
      ref={viewportRef}
      className="mt-5 cursor-grab overflow-hidden pl-5 active:cursor-grabbing"
      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {items.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="pr-[2px]"
            onPointerEnter={() => {
              hoverCount.current += 1;
            }}
            onPointerLeave={() => {
              hoverCount.current = Math.max(0, hoverCount.current - 1);
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
