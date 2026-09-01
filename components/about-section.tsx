import Image from "next/image";
import { ScrambleText } from "@/components/scramble-text";
import { PAGE_X } from "@/lib/ui";

const ABOUT_IMAGE_PRIMARY =
  "/Man_standing_in_city_traffic_202609010927.jpeg";
const ABOUT_IMAGE_SECONDARY =
  "/Man_posing_in_distressed_t-shirt_202609011608.jpeg";

function CornerMarks() {
  const corner = "absolute size-4 border-white pointer-events-none";

  return (
    <>
      <span className={`${corner} top-3 left-3 border-t border-l sm:top-4 sm:left-4`} />
      <span className={`${corner} top-3 right-3 border-t border-r sm:top-4 sm:right-4`} />
      <span className={`${corner} bottom-3 left-3 border-b border-l sm:bottom-4 sm:left-4`} />
      <span className={`${corner} bottom-3 right-3 border-b border-r sm:bottom-4 sm:right-4`} />
    </>
  );
}

function AboutPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[#111] lg:aspect-auto lg:min-h-[520px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover object-center"
        quality={90}
      />
    </div>
  );
}

export function AboutSection() {
  return (
    <section className={`bg-white pt-14 sm:pt-20 ${PAGE_X}`}>
      <div className="grid grid-cols-1 gap-[2px] lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)_minmax(0,1fr)] lg:items-stretch">
        <AboutPhoto
          src={ABOUT_IMAGE_PRIMARY}
          alt="DPE Moscow на улице"
        />

        <div className="relative flex aspect-[16/9] w-full flex-col justify-between bg-[#0c0c0c] px-5 py-6 text-white sm:px-7 sm:py-8 lg:aspect-auto lg:min-h-[520px] lg:px-8 lg:py-10">
          <CornerMarks />

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <img
              src="/dpe-logo.svg"
              alt="DPE"
              width={838}
              height={502}
              className="h-7 w-auto shrink-0 brightness-0 invert sm:h-10 lg:h-12"
            />

            <h2 className="mt-4 max-w-[300px] shrink-0 text-[11px] leading-[1.35] font-medium uppercase sm:mt-6 sm:max-w-[320px] sm:text-[14px] lg:mt-8 lg:text-[16px]">
              <ScrambleText
                text="DPE MOSCOW — БРЕНД ДЛЯ ТЕХ, КТО НЕ МОЛЧИТ"
                delay={0.1}
                duration={1.4}
              />
            </h2>

            <p className="mt-3 max-w-[300px] text-[10px] leading-[1.5] text-white/75 uppercase sm:mt-5 sm:max-w-[340px] sm:text-[12px] sm:leading-[1.6] lg:mt-6 lg:text-[13px] lg:leading-[1.65]">
              Мы создаём одежду с характером: дерзкие принты, оверсайз-крой и
              внимание к деталям. DPE — это про свободу быть собой и не
              подстраиваться под чужие правила.
            </p>

            <p className="mt-2 hidden max-w-[340px] text-[12px] leading-[1.6] text-white/55 uppercase sm:mt-4 sm:block lg:text-[13px] lg:leading-[1.65]">
              Каждая вещь — ограниченный тираж, сделанный для улицы, для
              движения и для тех, кто выбирает свой стиль без компромиссов.
            </p>
          </div>

          <a
            href="/about"
            className="group relative mt-4 flex h-10 w-full shrink-0 items-center justify-center overflow-hidden border border-white bg-white text-[11px] leading-none font-medium text-[#0c0c0c] uppercase transition-colors hover:bg-transparent hover:text-white sm:mt-6 sm:h-11 sm:text-[12px] lg:mt-8 lg:h-12 lg:text-[13px]"
          >
            <span className="relative">
              <ScrambleText
                text="ПОДРОБНЕЕ О НАС"
                delay={0.2}
                duration={0.9}
                replayOnHover
              />
            </span>
          </a>
        </div>

        <AboutPhoto
          src={ABOUT_IMAGE_SECONDARY}
          alt="Модель в футболке DPE Moscow"
        />
      </div>
    </section>
  );
}
