import type { Product } from "@/lib/products";

export type CatalogCategoryId =
  | "all"
  | "new"
  | "t-shirts"
  | "hoodies"
  | "shorts"
  | "shirts"
  | "pants"
  | "hats"
  | "accessories";

export type SortOption = "default" | "price-asc" | "price-desc" | "newest";

export const catalogCategories: {
  id: CatalogCategoryId;
  label: string;
}[] = [
  { id: "all", label: "СМОТРЕТЬ ВСЕ" },
  { id: "new", label: "НОВИНКИ" },
  { id: "t-shirts", label: "ФУТБОЛКИ" },
  { id: "hoodies", label: "ХУДИ" },
  { id: "shorts", label: "ШОРТЫ" },
  { id: "shirts", label: "РУБАШКИ" },
  { id: "pants", label: "ШТАНЫ" },
  { id: "hats", label: "ГОЛОВНЫЕ УБОРЫ" },
  { id: "accessories", label: "АКСЕССУАРЫ" },
];

export const catalogSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type CatalogSize = (typeof catalogSizes)[number];

export const sortOptions: { id: SortOption; label: string }[] = [
  { id: "default", label: "По умолчанию" },
  { id: "newest", label: "Сначала новинки" },
  { id: "price-asc", label: "Сначала дешевле" },
  { id: "price-desc", label: "Сначала дороже" },
];

const newProductIds = new Set(["tee-ne-zamechayu"]);

export function isNewProduct(product: Product) {
  return newProductIds.has(product.id);
}

export function filterCatalogProducts(
  products: Product[],
  {
    category,
    size,
  }: {
    category: CatalogCategoryId;
    size: CatalogSize | null;
  },
) {
  let result = [...products];

  if (category === "new") {
    result = result.filter((product) => isNewProduct(product));
  } else if (category !== "all") {
    result = result.filter((product) => product.category === category);
  }

  if (size) {
    result = result.filter((product) =>
      product.sizes.some((entry) => entry.label === size),
    );
  }

  return result;
}

export function sortCatalogProducts(products: Product[], sort: SortOption) {
  const items = [...products];

  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "newest":
      return items.sort(
        (a, b) => Number(isNewProduct(b)) - Number(isNewProduct(a)),
      );
    default:
      return items;
  }
}

export function expandCatalogProducts(products: Product[], times = 4) {
  if (!products.length) return [];
  return Array.from({ length: times }, () => products).flat();
}
