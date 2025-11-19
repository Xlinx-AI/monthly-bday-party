import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "12DR — 12 Дней Рождения в год",
  description: "12DR — платформа ежемесячных праздников. Празднуйте день рождения каждый месяц, встречайте новых друзей и получайте деньги",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 opacity-80"
              style={{
                background: "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.35), transparent 55%), radial-gradient(circle at 80% 10%, rgba(6, 182, 212, 0.25), transparent 50%), radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.25), transparent 50%)",
              }}
            />
          </div>
          <div className="relative z-10 flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
