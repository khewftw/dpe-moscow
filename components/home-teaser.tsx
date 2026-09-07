import Image from "next/image";

export function HomeTeaser() {
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-black">
      <a href="/catalog" className="absolute inset-0 block">
        <Image
          src="/Man_standing_in_city_traffic_202609010927.jpeg"
          alt="Смотреть каталог DPE MOSCOW"
          fill
          sizes="100vw"
          quality={90}
          loading="eager"
          className="object-cover object-center"
        />
        <span className="sr-only">Смотреть каталог</span>
      </a>
    </section>
  );
}
