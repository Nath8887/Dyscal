import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dyscal - Money Counter",
  description: "A money counter and change calculator app",
  manifest: "/manifest.json",
  themeColor: "#7CB8B1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dyscal",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body 
        className="min-h-screen bg-[#F9F9F2]"
        suppressHydrationWarning={true}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
