export const FREE_DELIVERY_THRESHOLD = 5000;

export const CART_STORAGE_KEY = "dpe-cart";
export const WISHLIST_STORAGE_KEY = "dpe-wishlist";

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  comment: string;
};

export function getCartLineKey(productId: string, size: string) {
  return `${productId}::${size}`;
}

export function parseCartLineKey(lineKey: string) {
  const [productId, size] = lineKey.split("::");
  return { productId, size };
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(
  items: CartItem[],
  getPrice: (productId: string) => number | undefined,
) {
  return items.reduce((total, item) => {
    const price = getPrice(item.productId);
    if (!price) return total;
    return total + price * item.quantity;
  }, 0);
}
