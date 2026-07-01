import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUX E — Luxury Fashion",
  description:
    "Temukan koleksi fashion premium pilihan. Buatan Indonesia, kualitas internasional.",
  keywords: ["fashion", "luxury", "indonesia", "premium", "lux e"],
  openGraph: {
    title:       "LUX E — Luxury Fashion",
    description: "Koleksi fashion premium pilihan buatan Indonesia.",
    type:        "website",
    locale:      "id_ID",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
