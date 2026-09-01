import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart-page";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HEADER_OFFSET } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина и оформление заказа DPE MOSCOW.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className={HEADER_OFFSET}>
        <CartPageContent />
        <Footer />
      </main>
    </>
  );
}
