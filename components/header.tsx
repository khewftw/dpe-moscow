"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart-provider";
import { HeaderSearch } from "@/components/header-search";
import { ScrambleText } from "@/components/scramble-text";
import { catalogCategories } from "@/lib/catalog";
import { PAGE_X } from "@/lib/ui";

const leftLinks = [
  { href: "/catalog", label: "КАТАЛОГ" },
  { href: "/customers", label: "ПОКУПАТЕЛЯМ" },
  { href: "/about", label: "О НАС" },
] as const;

const rightLinks = [{ href: "/contacts", label: "КОНТАКТЫ" }] as const;

const categoryLinks = catalogCategories.filter(
  (item) => item.id !== "all" && item.id !== "new",
);

const MOBILE_HEADER_HEIGHT = 72;

function HeaderIconLink({
  href,
  icon,
  label,
  count,
}: {
  href: string;
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <a
      href={href}
      className="relative flex size-5 items-center justify-center transition-opacity hover:opacity-60"
      aria-label={label}
    >
      <img src={icon} alt="" width={20} height={20} className="block" />
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 flex min-w-4 items-center justify-center rounded-full bg-[#0c0c0c] px-1 text-[9px] leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </a>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-9 items-center justify-center">
      <span
        className={`absolute block h-px w-5 bg-[#0c0c0c] transition-transform duration-300 ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[6px]"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-[#0c0c0c] transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-[#0c0c0c] transition-transform duration-300 ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[6px]"
        }`}
      />
    </span>
  );
}

function MobileMenu({
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
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
        style={{ top: MOBILE_HEADER_HEIGHT }}
        aria-label="Закрыть меню"
        onClick={onClose}
      />
      <aside
        id="mobile-menu"
        className={`fixed right-0 bottom-0 z-[100] w-[min(320px,88vw)] overflow-y-auto border-l border-[#e6e6e6] bg-white py-6 lg:hidden ${PAGE_X}`}
        style={{ top: MOBILE_HEADER_HEIGHT }}
        aria-label="Мобильное меню"
      >
        <nav className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {[...leftLinks, ...rightLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] leading-[1.2] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
                onClick={onClose}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <p className="mb-3 text-[11px] leading-none text-[#8d8d8d] uppercase">
              Категории
            </p>
            <div className="flex flex-col gap-3">
              {categoryLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/catalog?category=${link.id}`}
                  className="text-[13px] leading-[1.2] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e6e6e6] pt-5">
            <a
              href="/cart#wishlist"
              className="flex items-center justify-between text-[14px] leading-[1.2] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
              onClick={onClose}
            >
              <span>Избранное</span>
              {wishlistCount > 0 ? (
                <span className="text-[12px] text-[#8d8d8d]">
                  {wishlistCount}
                </span>
              ) : null}
            </a>
            <a
              href="/cart"
              className="flex items-center justify-between text-[14px] leading-[1.2] text-[#0c0c0c] uppercase transition-opacity hover:opacity-60"
              onClick={onClose}
            >
              <span>Корзина</span>
              {cartCount > 0 ? (
                <span className="text-[12px] text-[#8d8d8d]">{cartCount}</span>
              ) : null}
            </a>
          </div>
        </nav>
      </aside>
    </>,
    document.body,
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount, wishlistCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const toggleMenu = () => setMenuOpen((value) => !value);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-white text-black lg:z-40">
        <div className="flex flex-col">
          <div className="flex h-[20px] shrink-0 items-center justify-center overflow-hidden bg-black text-[11px] leading-none font-normal text-white sm:text-[12px]">
            <ScrambleText
              text="БЕСПЛАТНАЯ ДОСТАВКА ОТ 5 000 РУБ."
              delay={0.05}
              duration={1.8}
            />
          </div>

          <nav
            className={`relative z-10 flex min-h-[52px] items-center gap-2.5 border-t border-[#0c0c0c]/50 border-b border-[#e6e6e6] py-2 lg:hidden ${PAGE_X}`}
          >
            <a href="/" className="shrink-0" aria-label="DPE">
              <img
                src="/dpe-logo.svg"
                alt="DPE"
                width={838}
                height={502}
                className="block h-8 w-auto brightness-0"
              />
            </a>

            <HeaderSearch
              expanded={searchExpanded}
              onExpand={() => setSearchExpanded(true)}
              onCollapse={() => setSearchExpanded(false)}
            />

            <div className="flex shrink-0 items-center gap-2">
              <HeaderIconLink
                href="/cart#wishlist"
                icon="/icons/heart.svg"
                label="Избранное"
                count={wishlistCount}
              />
              <HeaderIconLink
                href="/cart"
                icon="/icons/bag.svg"
                label="Корзина"
                count={cartCount}
              />
            </div>

            <button
              type="button"
              className="relative z-20 shrink-0 touch-manipulation"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={(event) => {
                event.stopPropagation();
                toggleMenu();
              }}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </nav>

          <nav
            className={`relative hidden h-[56px] items-center justify-between border-t border-[#0c0c0c]/50 border-b border-[#e6e6e6] text-[12px] leading-[1.2] font-normal uppercase lg:flex ${PAGE_X}`}
          >
            <div className="flex min-w-[200px] items-center gap-3 xl:min-w-[240px] xl:gap-4">
              {leftLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-60"
                >
                  <ScrambleText
                    text={link.label}
                    delay={0.12 + index * 0.08}
                    duration={0.9}
                    replayOnHover
                  />
                </a>
              ))}
            </div>

            <a
              href="/"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-label="DPE"
            >
              <img
                src="/dpe-logo.svg"
                alt="DPE"
                width={838}
                height={502}
                className="block h-10 w-auto brightness-0 xl:h-12"
              />
            </a>

            <div className="flex min-w-[200px] items-center justify-end gap-3 xl:min-w-[280px] xl:gap-4">
              {rightLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-60"
                >
                  <ScrambleText
                    text={link.label}
                    delay={0.36 + index * 0.08}
                    duration={0.9}
                    replayOnHover
                  />
                </a>
              ))}

              <div className="w-[140px]">
                <HeaderSearch
                  expanded={searchExpanded}
                  onExpand={() => setSearchExpanded(true)}
                  onCollapse={() => setSearchExpanded(false)}
                />
              </div>

              <HeaderIconLink
                href="/cart#wishlist"
                icon="/icons/heart.svg"
                label="Избранное"
                count={wishlistCount}
              />
              <HeaderIconLink
                href="/cart"
                icon="/icons/bag.svg"
                label="Корзина"
                count={cartCount}
              />
            </div>
          </nav>
        </div>
      </header>

      {mounted ? (
        <MobileMenu
          open={menuOpen}
          onClose={closeMenu}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />
      ) : null}
    </>
  );
}
