"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleText } from "@/components/scramble-text";
import { PAGE_X } from "@/lib/ui";

const WINDOWS_BLUE = "#000080";
const FILL_DURATION = 0.55;
const FILL_EASE = "power2.inOut";

const featured = [
  {
    href: "/catalog?category=t-shirts",
    label: "ФУТБОЛКИ",
    image: "/images/categories/Young_man_standing_outdoors_2K_202609011033.jpeg",
  },
  {
    href: "/catalog?category=hoodies",
    label: "ХУДИ",
    image: "/images/categories/hoodie.jpeg",
  },
  {
    href: "/catalog?category=shorts",
    label: "ШОРТЫ",
    image: "/images/categories/Man_sitting_wearing_athletic_shorts_202609011039.jpeg",
  },
] as const;

const plates = [
  { href: "/catalog?category=shirts", code: "//SHIRTS", label: "РУБАШКИ" },
  { href: "/catalog?category=pants", code: "//PANTS", label: "ШТАНЫ" },
  { href: "/catalog?category=hats", code: "//HATS", label: "ГОЛОВНЫЕ УБОРЫ" },
  {
    href: "/catalog?category=accessories",
    code: "//ACCESSORIES",
    label: "АКСЕССУАРЫ",
  },
] as const;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H3.75M9.5 2.5V8.25"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function originY(fromTop: boolean) {
  return fromTop ? "50% 0%" : "50% 100%";
}

function supportsHoverFill() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function Categories() {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseY = useRef(0);
  const prevMouseY = useRef(0);
  const [active, setActive] = useState<number | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);

  useEffect(() => {
    setHoverEnabled(supportsHoverFill());

    fillRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scaleY: 0, transformOrigin: "50% 0%" });
    });

    const onMove = (event: PointerEvent) => {
      prevMouseY.current = mouseY.current;
      mouseY.current = event.clientY;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const movingDown = () => mouseY.current > prevMouseY.current;

  const fillIn = (index: number) => {
    if (!hoverEnabled) return;

    const el = fillRefs.current[index];
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fromTop = movingDown();

    if (reduced) {
      gsap.set(el, { scaleY: 1, transformOrigin: originY(fromTop) });
      return;
    }

    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: originY(fromTop), scaleY: 0 });
    gsap.to(el, {
      scaleY: 1,
      duration: FILL_DURATION,
      ease: FILL_EASE,
      overwrite: true,
    });
  };

  const fillOut = (index: number) => {
    if (!hoverEnabled) return;

    const el = fillRefs.current[index];
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const towardBottom = movingDown();

    if (reduced) {
      gsap.set(el, { scaleY: 0 });
      return;
    }

    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: originY(!towardBottom) });
    gsap.to(el, {
      scaleY: 0,
      duration: FILL_DURATION,
      ease: FILL_EASE,
      overwrite: true,
    });
  };

  return (
    <section className="bg-white">
      <div className={`pt-14 sm:pt-20 ${PAGE_X}`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[18px] leading-[1.15] font-medium text-[#0c0c0c] uppercase sm:text-[20px]">
            Категории
          </h2>
          <a
            href="/catalog"
            className="flex shrink-0 items-center gap-1.5 text-[12px] leading-[1.2] font-normal text-[#0c0c0c] uppercase transition-colors hover:text-[#000080]"
          >
            <ScrambleText
              text="В КАТАЛОГ"
              delay={0.2}
              duration={0.9}
              replayOnHover
            />
            <ArrowIcon className="size-3" />
          </a>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-[2px]">
          {featured.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative block aspect-square overflow-hidden bg-[#111]"
            >
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform group-hover:scale-[1.045]">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  quality={90}
                  className="object-cover object-center"
                />
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  quality={90}
                  className="object-cover object-center grayscale transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0"
                />
              </div>
              <div className="pointer-events-none absolute top-1/2 left-0 z-10 flex h-[13px] w-full -translate-y-1/2 items-center justify-center bg-white sm:h-[15px]">
                <p className="text-[9px] leading-none font-medium text-[#0c0c0c] uppercase sm:text-[13px]">
                  <ScrambleText
                    text={item.label}
                    delay={0.15 + index * 0.08}
                    duration={0.9}
                    replayOnHover
                  />
                </p>
              </div>
            </a>
          ))}
        </div>

        <div
          ref={listRef}
          className="relative mt-[2px] overflow-hidden border-t border-[#e6e6e6]"
        >
          {plates.map((plate, index) => {
            const isActive = hoverEnabled && active === index;
            return (
              <a
                key={plate.href}
                href={plate.href}
                className="relative z-10 grid h-[48px] grid-cols-[1fr_auto] items-center gap-3 overflow-hidden border-b border-[#e6e6e6] bg-white px-0 text-center md:h-[58px] md:grid-cols-[minmax(132px,16%)_1fr_auto] md:px-5 md:text-left"
                onMouseEnter={() => {
                  setActive(index);
                  fillIn(index);
                }}
                onMouseLeave={(event) => {
                  fillOut(index);
                  const next = event.relatedTarget;
                  if (
                    !(next instanceof Node) ||
                    !listRef.current?.contains(next)
                  ) {
                    setActive(null);
                  }
                }}
              >
                {hoverEnabled ? (
                  <span
                    ref={(node) => {
                      fillRefs.current[index] = node;
                    }}
                    className="pointer-events-none absolute inset-0 z-0 will-change-transform"
                    style={{ backgroundColor: WINDOWS_BLUE }}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`relative z-10 hidden text-[12px] leading-none font-normal uppercase transition-colors duration-300 md:block ${
                    isActive ? "text-white/55" : "text-[#8d8d8d]"
                  }`}
                >
                  {plate.code}
                </span>
                <span
                  className={`relative z-10 col-span-1 text-[12px] leading-none font-medium uppercase transition-colors duration-300 md:col-span-1 md:text-[14px] ${
                    isActive ? "text-white" : "text-[#0c0c0c]"
                  }`}
                >
                  <ScrambleText
                    text={plate.label}
                    delay={0.08 * index}
                    duration={0.85}
                    replayOnHover
                  />
                </span>
                <ArrowIcon
                  className={`relative z-10 size-3 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-[#0c0c0c]"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="pt-[2px]">
          <a
            href="/catalog"
            className="group relative flex h-12 items-center justify-center overflow-hidden bg-black text-[12px] leading-none font-medium text-white uppercase sm:h-14 sm:text-[13px]"
          >
            <span
              className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              aria-hidden
              style={{ backgroundColor: WINDOWS_BLUE }}
            />
            <span className="relative">
              <ScrambleText
                text="ПЕРЕЙТИ В КАТАЛОГ"
                delay={0.4}
                duration={1.1}
                replayOnHover
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
