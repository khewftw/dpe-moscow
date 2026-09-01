import { RollingNumber } from "@/components/rolling-number";

type QuantityControlProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
};

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantityControlProps) {
  const buttonClass =
    size === "sm"
      ? "flex size-8 items-center justify-center text-[16px] leading-none"
      : "flex size-10 items-center justify-center text-[18px] leading-none";

  const valueClass =
    size === "sm"
      ? "min-w-8 text-center text-[13px] leading-none"
      : "min-w-10 text-center text-[14px] leading-none";

  return (
    <div className="inline-flex items-center border border-[#e6e6e6]">
      <button
        type="button"
        aria-label="Уменьшить количество"
        className={`${buttonClass} text-[#0c0c0c] transition-colors hover:bg-[#fafafa]`}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <RollingNumber className={valueClass} value={value} />
      <button
        type="button"
        aria-label="Увеличить количество"
        className={`${buttonClass} text-[#0c0c0c] transition-colors hover:bg-[#fafafa]`}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
