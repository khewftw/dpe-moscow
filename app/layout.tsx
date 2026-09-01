import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
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
      className={`${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className={`${ibmPlexMono.className} min-h-full bg-white text-[#0c0c0c]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
