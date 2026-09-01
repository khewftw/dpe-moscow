"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductLightboxProps = {
  sourceImage: HTMLImageElement;
  originRect: DOMRect;
  alt: string;
  onClose: () => void;
};

const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

export function ProductLightbox({
  sourceImage,
  originRect,
  alt,
  onClose,
}: ProductLightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closingRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  });

  const targetSize = () =>
    Math.min(window.innerWidth * 0.88, window.innerHeight * 0.88, 720);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) {
      onClose();
      return;
    }

    gsap.to(backdrop, { opacity: 0, duration: 0.35, ease: "power2.in" });
    gsap.to(panel, {
      top: originRect.top,
      left: originRect.left,
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      width: originRect.width,
      height: originRect.height,
      duration: 0.45,
      ease: "power3.inOut",
      onComplete: onClose,
    });
  }, [onClose, originRect]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    const size = targetSize();
    document.body.style.overflow = "hidden";

    gsap.set(panel, {
      position: "fixed",
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
    });

    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: "power2.out" },
    );

    gsap.to(panel, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      width: size,
      height: size,
      duration: 0.55,
      ease: "power3.out",
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [originRect]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((value) =>
        Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value - event.deltaY * 0.0018)),
      );
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => panel.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setPan({
      x: dragRef.current.panX + (event.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (event.clientY - dragRef.current.startY),
    });
  };

  const endDrag = (event: React.PointerEvent) => {
    setDragging(false);
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 opacity-0"
        onClick={close}
        aria-hidden
      />

      <button
        type="button"
        onClick={close}
        className="absolute top-6 right-6 z-[102] flex size-10 items-center justify-center text-[28px] leading-none text-white transition-opacity hover:opacity-70"
        aria-label="Закрыть"
      >
        ×
      </button>

      <div
        ref={panelRef}
        className="fixed overflow-visible will-change-transform"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          touchAction: zoom > 1 ? "none" : "auto",
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={sourceImage.currentSrc || sourceImage.src}
            alt={alt}
            draggable={false}
            className="block h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
