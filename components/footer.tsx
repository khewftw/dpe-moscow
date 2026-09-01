import { PAGE_X } from "@/lib/ui";

export function Footer() {
  return (
    <footer className={`border-t border-[#e6e6e6] bg-white pt-12 pb-10 ${PAGE_X}`}>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <img
            src="/dpe-logo.svg"
            alt="DPE"
            width={838}
            height={502}
            className="block h-8 w-auto brightness-0"
          />
          <p className="mt-4 max-w-[280px] text-[12px] leading-[1.5] text-[#8d8d8d] uppercase">
            DPE MOSCOW — бренд одежды с дерзким характером
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[12px] leading-[1.2] font-medium text-[#0c0c0c] uppercase">
              Каталог
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase">
              <li>
                <a href="/catalog?category=t-shirts" className="hover:text-[#0c0c0c]">
                  Футболки
                </a>
              </li>
              <li>
                <a href="/catalog?category=hoodies" className="hover:text-[#0c0c0c]">
                  Худи
                </a>
              </li>
              <li>
                <a href="/catalog?category=shorts" className="hover:text-[#0c0c0c]">
                  Шорты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] leading-[1.2] font-medium text-[#0c0c0c] uppercase">
              Покупателям
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase">
              <li>
                <a href="/customers" className="hover:text-[#0c0c0c]">
                  Доставка
                </a>
              </li>
              <li>
                <a href="/customers" className="hover:text-[#0c0c0c]">
                  Оплата
                </a>
              </li>
              <li>
                <a href="/customers" className="hover:text-[#0c0c0c]">
                  Возврат
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[12px] leading-[1.2] font-medium text-[#0c0c0c] uppercase">
              Контакты
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase">
              <li>
                <a href="mailto:hello@dpe.moscow" className="hover:text-[#0c0c0c]">
                  hello@dpe.moscow
                </a>
              </li>
              <li>
                <a href="/contacts" className="hover:text-[#0c0c0c]">
                  Москва
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#0c0c0c]">
                  О бренде
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-[#e6e6e6] pt-5 text-[12px] leading-[1.2] text-[#8d8d8d] uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DPE MOSCOW</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <a href="/privacy" className="hover:text-[#0c0c0c]">
            Политика конфиденциальности
          </a>
          <a href="/terms" className="hover:text-[#0c0c0c]">
            Условия использования
          </a>
        </div>
      </div>
    </footer>
  );
}
