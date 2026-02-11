import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import localFont from "next/font/local";

const libre = localFont({
  src: [
    {
      path: "../fonts/LibreBaskerville-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/LibreBaskerville-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const oxygen = localFont({
  src: [
    {
      path: "../fonts/OxygenMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcliptixAI | Academic Analytics Dashboard",
  description:
    "Academic program management, faculty workload optimization, and employability analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${libre.variable} ${oxygen.variable}`}
    >
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
