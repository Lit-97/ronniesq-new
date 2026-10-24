import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ronnie's Q",
  description: "Ronnie's Q restaurant website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Forum&family=Kaisei+Opti:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body id="top">
        {children}

        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}