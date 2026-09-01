"use client";

import { useId, useState } from "react";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="relative border-t border-[#e6e6e6]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-[56px] w-full touch-manipulation items-center justify-between text-left text-[15px] leading-[1.2] font-normal text-[#0c0c0c] uppercase sm:h-[64px] sm:text-[16px]"
      >
        <span>{title}</span>
        <span
          className="relative block size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[#0c0c0c]" />
          <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-[#0c0c0c]" />
        </span>
      </button>

      <div
        id={panelId}
        className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "max-h-[2400px]" : "max-h-0"
        }`}
      >
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}
