"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useCart } from "@/components/cart-provider";
import { HeaderSearch } from "@/components/header-search";
import { catalogCategories } from "@/lib/catalog";

const pageLinks = [
  { href: "/catalog", label: "КАТАЛОГ" },
  { href: "/customers", label: "ПОКУПАТЕЛЯМ" },
  { href: "/about", label: "О НАС" },
  { href: "/contacts", label: "КОНТАКТЫ" },
] as const;

const categoryLinks = catalogCategories.filter(
  (item) => item.id !== "all" && item.id !== "new",
);

const TICKER_HEIGHT = 20;
const NAV_HEIGHT = 56;
const DOCKED_TOP = TICKER_HEIGHT;

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M16.5944 5.14285L7.34409 5.14628C7.05622 5.14629 6.77897 5.25493 6.56773 5.45049C6.35649 5.64605 6.22683 5.91413 6.20466 6.20114L5.2378 18.7691L5.23438 18.8571C5.23438 19.1602 5.35478 19.4509 5.56911 19.6653C5.78344 19.8796 6.07413 20 6.37723 20H17.6172L17.7087 19.9966C17.8583 19.9845 18.0041 19.943 18.1377 19.8745C18.2713 19.806 18.3901 19.7119 18.4873 19.5975C18.5846 19.4831 18.6583 19.3506 18.7043 19.2077C18.7503 19.0648 18.7677 18.9142 18.7555 18.7646L17.7338 6.19428C17.7108 5.90788 17.5808 5.64065 17.3696 5.44581C17.1585 5.25096 16.8817 5.14279 16.5944 5.14285Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4284 9.71428V10.4514C15.4284 11.7143 13.2627 12 11.9999 12C10.737 12 8.57129 11.5486 8.57129 10.2857V9.71428"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-9 items-center justify-center">
      <span
        className={`absolute block h-px w-5 bg-current transition-transform duration-300 ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[5px]"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-current transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-current transition-transform duration-300 ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
        }`}
      />
    </span>
  );
}

function SiteMenu({
  open,
  onClose,
  cartCount,
  wishlistCount,
}: {
  open: boolean;
  onClose: () => void;
  cartCount: number;
  wishlistCount: number;
}) {
  if (!open) return null;

  return createPortal(
    <aside
      id="site-menu"
      className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-black px-6 py-10 text-white sm:px-10 lg:px-16"
      aria-label="Меню"
    >
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-[28px] leading-none font-black tracking-tight sm:text-[34px]">
            DPE
          </p>
          <p className="mt-3 max-w-[220px] text-[11px] leading-[1.45] tracking-[0.16em] text-white/55 uppercase">
            Бренд для тех, кто не молчит
          </p>
        </div>

        <div>
          <p className="text-[11px] leading-none tracking-[0.22em] text-white/45 uppercase">
            Каталог
          </p>
          <nav className="mt-5 flex flex-col gap-3">
            {categoryLinks.map((link) => (
              <a
                key={link.id}
                href={`/catalog?category=${link.id}`}
                className="font-condensed text-[22px] leading-none tracking-tight uppercase transition-opacity hover:opacity-60"
                onClick={onClose}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/catalog"
              className="mt-2 text-[11px] leading-none tracking-[0.18em] text-white/55 uppercase transition-opacity hover:text-white"
              onClick={onClose}
            >
              Смотреть всё
            </a>
          </nav>
        </div>

        <div>
          <p className="text-[11px] leading-none tracking-[0.22em] text-white/45 uppercase">
            Информация
          </p>
          <nav className="mt-5 flex flex-col gap-3">
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-condensed text-[22px] leading-none tracking-tight uppercase transition-opacity hover:opacity-60"
                onClick={onClose}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/cart#wishlist"
              className="font-condensed text-[22px] leading-none tracking-tight uppercase transition-opacity hover:opacity-60"
              onClick={onClose}
            >
              Избранное{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </a>
            <a
              href="/cart"
              className="font-condensed text-[22px] leading-none tracking-tight uppercase transition-opacity hover:opacity-60"
              onClick={onClose}
            >
              Корзина{cartCount > 0 ? ` (${cartCount})` : ""}
            </a>
          </nav>
        </div>
      </div>
    </aside>,
    document.body,
  );
}

function heroLogoSize() {
  return Math.min(118, Math.max(52, window.innerWidth * 0.098));
}

function dockedLogoSize() {
  return window.innerWidth >= 640 ? 34 : 24;
}

function scrollDock() {
  const max = Math.min(340, Math.max(170, window.innerHeight * 0.32));
  const progress = Math.min(1, Math.max(0, window.scrollY / max));
  return 1 - (1 - progress) ** 3;
}

function centeredShift() {
  return window.innerHeight / 2 - NAV_HEIGHT / 2 - DOCKED_TOP;
}

export function Header({ hero = false }: { hero?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuOpenRef = useRef(menuOpen);

  menuOpenRef.current = menuOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    if (!header || !logo) return;

    if (!hero) {
      gsap.set(header, { y: 0 });
      gsap.set(logo, { clearProps: "fontSize" });
      document.documentElement.style.setProperty(
        "--search-top",
        `${TICKER_HEIGHT + NAV_HEIGHT}px`,
      );
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const apply = (immediate = false) => {
      const dock = menuOpenRef.current || reduced ? 1 : scrollDock();
      const y = centeredShift() * (1 - dock);
      const fontSize =
        dockedLogoSize() + (heroLogoSize() - dockedLogoSize()) * (1 - dock);

      if (immediate || reduced) {
        gsap.set(header, { y });
        gsap.set(logo, { fontSize });
      } else {
        gsap.to(header, {
          y,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(logo, {
          fontSize,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      document.documentElement.style.setProperty(
        "--search-top",
        `${DOCKED_TOP + NAV_HEIGHT + y}px`,
      );
    };

    apply(true);

    if (reduced) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      gsap.killTweensOf([header, logo]);
    };
  }, [hero, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => {
    setSearchExpanded(false);
    setMenuOpen((value) => !value);
  };

  return (
    <>
      <div className="pointer-events-auto fixed top-0 right-0 left-0 z-50 flex h-5 items-center justify-center overflow-hidden bg-black text-[10px] leading-none tracking-[0.22em] text-white uppercase sm:text-[11px]">
        Бесплатная доставка от 5 000 руб.
      </div>

      <header
        ref={headerRef}
        className={`pointer-events-none fixed top-5 right-0 left-0 z-50 mix-blend-difference ${
          hero ? "translate-y-[calc(50dvh-3rem)] will-change-transform" : ""
        }`}
      >
        <nav className="pointer-events-auto relative">
          <div className="relative flex h-14 items-center px-4 text-white sm:px-6">
            <button
              type="button"
              className="relative z-20 -ml-2 touch-manipulation"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={toggleMenu}
            >
              <BurgerIcon open={menuOpen} />
            </button>

            <a
              ref={logoRef}
              href="/"
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display leading-none font-black tracking-[-0.04em] ${
                hero
                  ? "text-[52px] sm:text-[88px] lg:text-[112px]"
                  : "text-[24px] sm:text-[34px]"
              }`}
              aria-label="DPE"
            >
              DPE
            </a>

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <HeaderSearch
                expanded={searchExpanded}
                onExpand={() => {
                  setMenuOpen(false);
                  setSearchExpanded(true);
                }}
                onCollapse={() => setSearchExpanded(false)}
              />
              <a
                href="/cart"
                className="flex items-center gap-1 pr-1 text-[11px] leading-none tracking-[0.12em] uppercase transition-opacity hover:opacity-60"
                aria-label="Корзина"
              >
                <BagIcon className="size-5" />
                <span>{cartCount}</span>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {mounted ? (
        <SiteMenu
          open={menuOpen}
          onClose={closeMenu}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />
      ) : null}
    </>
  );
}
