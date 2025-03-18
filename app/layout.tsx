import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Dyscal - Money Counter",
  description: "A money counter and change calculator app",
  manifest: "/manifest.json",
  themeColor: "#7CB8B1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
