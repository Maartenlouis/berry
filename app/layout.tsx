import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          data-domain="https://berry-blue.vercel.app"
          data-api="/plausible/api/event"
          src="/plausible/js/script.js"
        ></script>
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
