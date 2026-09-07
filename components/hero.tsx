"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const SCALE = 1.06;
const STRENGTH = 0.008;
const LAG = 1.05;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    gsap.set(media, { scale: SCALE, x: 0, y: 0 });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const xTo = gsap.quickTo(media, "x", {
      duration: LAG,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(media, "y", {
      duration: LAG + 0.15,
      ease: "power3.out",
    });

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * rect.width * STRENGTH * 2);
      yTo(ny * rect.height * STRENGTH * 2);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(media);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-black"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/Man_standing_against_stone_wall_202609011007.jpeg"
          alt="DPE MOSCOW"
          fill
          sizes="100vw"
          className="object-cover object-center"
          preload
          quality={90}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/45 to-transparent" />

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 h-[2px] w-10 -translate-x-1/2 rounded-full bg-white/80" />
    </section>
  );
}
