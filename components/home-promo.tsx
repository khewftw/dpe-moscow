import Image from "next/image";

const PROMO_IMAGE = "/Man_posing_in_distressed_t-shirt_202609011608.jpeg";

export function HomePromo() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <div className="relative h-[70svh] overflow-hidden bg-[#111] lg:h-[100svh]">
        <Image
          src={PROMO_IMAGE}
          alt="DPE MOSCOW"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={90}
          loading="eager"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-h-[70svh] flex-col justify-between bg-[#f3f1ec] px-6 py-16 sm:px-12 lg:min-h-[100svh] lg:px-16 lg:py-20">
        <p className="text-[11px] leading-none tracking-[0.22em] text-[#0c0c0c]/55 uppercase">
          SS26
        </p>

        <div className="my-16">
          <h2 className="font-condensed text-[18vw] leading-[0.85] font-medium tracking-tight text-[#0c0c0c] uppercase lg:text-[7.5vw]">
            DPE
            <br />
            MOSCOW
          </h2>
          <p className="mt-8 max-w-[360px] text-[13px] leading-[1.6] tracking-[0.04em] text-[#0c0c0c]/80">
            Бренд для тех, кто не молчит. Мы создаём одежду с характером:
            дерзкие принты, оверсайз-крой и внимание к деталям.
          </p>
        </div>

        <a
          href="/about"
          className="inline-flex h-11 w-fit items-center justify-center border border-[#0c0c0c] bg-white px-7 text-[11px] leading-none tracking-[0.18em] text-[#0c0c0c] uppercase transition-colors hover:bg-[#0c0c0c] hover:text-white"
        >
          Подробнее о нас
        </a>
      </div>
    </section>
  );
}
