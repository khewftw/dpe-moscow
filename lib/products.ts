export type ProductSize = {
  label: string;
  length: string;
  shoulder: string;
  chest: string;
  sleeve: string;
};

export type Product = {
  id: string;
  name: string;
  manual: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  image: string;
  hoverImage?: string;
  sku: string;
  category: string;
  categoryLabel: string;
  color: string;
  otherColors?: string;
  images: string[];
  sizes: ProductSize[];
  composition: string;
  paymentDelivery: string;
};

// Bump when product images are replaced at the same path.
const IMAGE_CACHE_VERSION = "20260901-2";

function img(path: string) {
  return `${path}?v=${IMAGE_CACHE_VERSION}`;
}

const teeSizes: ProductSize[] = [
  {
    label: "XS",
    length: "68",
    shoulder: "46",
    chest: "50",
    sleeve: "21",
  },
  {
    label: "S",
    length: "70",
    shoulder: "48",
    chest: "52",
    sleeve: "22",
  },
  {
    label: "M",
    length: "72",
    shoulder: "50",
    chest: "54",
    sleeve: "23",
  },
  {
    label: "L",
    length: "74",
    shoulder: "52",
    chest: "56",
    sleeve: "24",
  },
  {
    label: "XL",
    length: "76",
    shoulder: "54",
    chest: "58",
    sleeve: "25",
  },
  {
    label: "XXL",
    length: "78",
    shoulder: "56",
    chest: "60",
    sleeve: "26",
  },
];

const catalog: Product[] = [
  {
    id: "tee-pohuy",
    name: "POHUY+POHUY TEE",
    manual: "DPE",
    price: 4990,
    sku: "DPE-TEE-001",
    category: "t-shirts",
    categoryLabel: "ФУТБОЛКИ",
    color: "Кремовый",
    otherColors: "Серый",
    image: img("/images/products/tee-pohuy/tee-pohuy.jpeg"),
    hoverImage: img("/images/products/tee-pohuy/front.png"),
    images: [
      img("/images/products/tee-pohuy/tee-pohuy.jpeg"),
      img("/images/products/tee-pohuy/front.png"),
      img("/images/products/tee-pohuy/model.png"),
    ],
    sizes: teeSizes,
    composition:
      "100% хлопок, плотность 240 г/м². Мягкая винтажная стирка, прямой крой, принт на груди.",
    paymentDelivery:
      "Оплата картой, СБП или при получении. Бесплатная доставка от 5 000 руб. по Москве — 1–2 дня, по России — 3–7 дней.",
  },
  {
    id: "tee-zhertva",
    name: "Я ЖЕРТВА КАЙФА TEE",
    manual: "DPE",
    price: 4990,
    sku: "DPE-TEE-002",
    category: "t-shirts",
    categoryLabel: "ФУТБОЛКИ",
    color: "Чёрный",
    otherColors: "Белый",
    image: img("/images/products/tee-zhertva/tee-zhertva.jpeg"),
    hoverImage: img("/images/products/tee-zhertva/front.png"),
    images: [
      img("/images/products/tee-zhertva/tee-zhertva.jpeg"),
      img("/images/products/tee-zhertva/front.png"),
      img("/images/products/tee-zhertva/model.png"),
    ],
    sizes: teeSizes,
    composition:
      "100% хлопок, плотность 240 г/м². Дистресс-обработка, оверсайз-крой, графический принт.",
    paymentDelivery:
      "Оплата картой, СБП или при получении. Бесплатная доставка от 5 000 руб. по Москве — 1–2 дня, по России — 3–7 дней.",
  },
  {
    id: "tee-ne-zamechayu",
    name: "NE ZAMECHAYU PROBLEMY TEE",
    manual: "DPE",
    price: 4990,
    sku: "DPE-TEE-003",
    category: "t-shirts",
    categoryLabel: "ФУТБОЛКИ",
    color: "Чёрный",
    image: img("/images/products/tee-ne-zamechayu/tee-ne-zamechayu.jpeg"),
    hoverImage: img("/images/products/tee-ne-zamechayu/front.png"),
    images: [
      img("/images/products/tee-ne-zamechayu/tee-ne-zamechayu.jpeg"),
      img("/images/products/tee-ne-zamechayu/front.png"),
      img("/images/products/tee-ne-zamechayu/model.png"),
    ],
    sizes: teeSizes,
    composition:
      "100% хлопок, плотность 240 г/м². Классический крой, мягкая ткань, принт спереди.",
    paymentDelivery:
      "Оплата картой, СБП или при получении. Бесплатная доставка от 5 000 руб. по Москве — 1–2 дня, по России — 3–7 дней.",
  },
];

function duplicate(items: Product[], times: number) {
  return Array.from({ length: times }, () => items).flat();
}

export const bestsellers = duplicate(catalog, 3);
export const newArrivals = duplicate(catalog, 3);

export function getProductById(id: string) {
  return catalog.find((product) => product.id === id);
}

export function getRelatedProducts(id: string) {
  return catalog.filter((product) => product.id !== id);
}

export function getAllProductIds() {
  return catalog.map((product) => product.id);
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return catalog.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.manual.toLowerCase().includes(normalized) ||
      product.sku.toLowerCase().includes(normalized),
  );
}

export function formatPrice(value: number) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} р.`;
}

export function getAllProducts() {
  return catalog;
}

export function getLookImage(product: Product) {
  const look = product.images.find((src) => src.includes("/model."));
  return look ?? product.hoverImage ?? product.image;
}

export function getCatalogProducts(times = 4) {
  return duplicate(catalog, times);
}
