import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "DysCal - Finding Solutions",
  description: "A calculator app designed to assist users with dyscalculia and dyslexia in calculating change.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heiti+TC:wght@400;700&display=swap"
          rel="stylesheet"
        />
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
