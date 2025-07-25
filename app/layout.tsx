import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maislabyrinth-Rätsel - Erdbeerhof Gleidingen",
  description: "Löse das Maislabyrinth-Rätsel und finde das Lösungswort!",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="berry-blue.vercel.app"
          data-api="/plausible/api/event"
          src="/plausible/js/script.js"
        ></script>
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
