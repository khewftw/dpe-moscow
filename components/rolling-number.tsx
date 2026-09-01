"use client";

import { useEffect, useRef, useState } from "react";

type RollingNumberProps = {
  value: number;
  className?: string;
};

export function RollingNumber({ value, className = "" }: RollingNumberProps) {
  const previousRef = useRef(value);
  const [previous, setPrevious] = useState(value);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value === previousRef.current) return;

    setDirection(value > previousRef.current ? "up" : "down");
    setPrevious(previousRef.current);
    previousRef.current = value;
    setAnimating(true);

    const timer = window.setTimeout(() => setAnimating(false), 320);
    return () => window.clearTimeout(timer);
  }, [value]);

  if (!animating) {
    return (
      <span
        className={`inline-flex min-w-[1.25ch] items-center justify-center tabular-nums ${className}`}
      >
        {value}
      </span>
    );
  }

  const outgoingClass =
    direction === "up" ? "rolling-number-out-up" : "rolling-number-out-down";
  const incomingClass =
    direction === "up" ? "rolling-number-in-up" : "rolling-number-in-down";

  return (
    <span
      className={`relative inline-flex h-[1em] min-w-[1.25ch] items-center justify-center overflow-hidden tabular-nums ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        key={`${previous}-out`}
        className={`absolute inset-x-0 flex items-center justify-center ${outgoingClass}`}
      >
        {previous}
      </span>
      <span
        key={`${value}-in`}
        className={`absolute inset-x-0 flex items-center justify-center ${incomingClass}`}
      >
        {value}
      </span>
    </span>
  );
}
