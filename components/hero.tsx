"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleText } from "@/components/scramble-text";

const SCALE = 1.08;
const STRENGTH = 0.01;
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
      className="relative mt-[72px] h-[calc(100svh-72px)] overflow-hidden bg-black lg:mt-[76px] lg:h-[calc(100svh-76px)]"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/Man_standing_against_stone_wall_202609011007.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          preload
          quality={90}
        />
      </div>

      <div className="pointer-events-none absolute top-1/2 left-0 z-10 flex h-[20px] w-full -translate-y-1/2 items-center justify-center bg-white px-5">
        <p className="text-center text-[11px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[13px]">
          <ScrambleText
            text="ДЕРЗКИЙ СТИЛЬ ДЛЯ СМЕЛЫХ ЛИЧНОСТЕЙ"
            delay={0.35}
            duration={1.6}
          />
        </p>
      </div>
    </section>
  );
}
