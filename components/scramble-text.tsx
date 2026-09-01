"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789!#?*+=_-^/[]{}";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#";
}

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  replayOnHover?: boolean;
};

export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 1.15,
  replayOnHover = false,
}: ScrambleTextProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const delayCallRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const chars = Array.from(text);

    const stop = () => {
      delayCallRef.current?.kill();
      tweenRef.current?.kill();
      delayCallRef.current = null;
      tweenRef.current = null;
    };

    const play = (startDelay = delay) => {
      stop();

      if (reduced) {
        node.textContent = text;
        return;
      }

      const run = () => {
        const proxy = { amount: 0 };
        tweenRef.current = gsap.to(proxy, {
          amount: 1,
          duration,
          ease: "none",
          onUpdate: () => {
            const decoded = proxy.amount * (chars.length + 3);
            node.textContent = chars
              .map((char, index) => {
                if (char === " ") return " ";
                if (index < decoded - 1.5) return char;
                return randomGlyph();
              })
              .join("");
          },
          onComplete: () => {
            node.textContent = text;
          },
        });
      };

      delayCallRef.current = gsap.delayedCall(startDelay, run);
    };

    play();

    const onEnter = () => play(0);

    if (replayOnHover) {
      const hoverRoot =
        node.closest("a, button") ?? node.parentElement;
      hoverRoot?.addEventListener("mouseenter", onEnter);
      return () => {
        hoverRoot?.removeEventListener("mouseenter", onEnter);
        stop();
        node.textContent = text;
      };
    }

    return () => {
      stop();
      node.textContent = text;
    };
  }, [text, delay, duration, replayOnHover]);

  return (
    <span
      ref={nodeRef}
      className={`inline-block whitespace-nowrap ${className ?? ""}`}
      aria-label={text}
    >
      {text}
    </span>
  );
}
