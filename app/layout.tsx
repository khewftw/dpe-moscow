import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

const oswald = Oswald({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: {
    default: "DPE MOSCOW — бренд одежды",
    template: "%s | DPE MOSCOW",
  },
  description:
    "DPE MOSCOW — бренд одежды с дерзким характером. Уникальный стиль для смелых личностей.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${playfair.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full bg-white text-[#0c0c0c]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
