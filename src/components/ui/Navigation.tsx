"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "🎉 Мои События", icon: "🎉" },
    { href: "/events", label: "✨ Лента", icon: "✨" },
    { href: "/profile", label: "👤 Профиль", icon: "👤" },
  ];

  return (
    <nav className="glass-effect border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-2xl font-black text-gradient hover:scale-110 transition-transform"
              onClick={() => setIsMenuOpen(false)}
            >
              12DR
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden gap-2 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    pathname === link.href
                      ? "glass-card text-white"
                      : "text-gray-300 hover:text-white hover:glass-effect"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop Logout */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="glass-effect px-5 py-2.5 text-sm font-bold text-gray-200 rounded-xl transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {loading ? "⏳ Выход..." : "👋 Выйти"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <span className="sr-only">Открыть меню</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-b border-white/10 animate-fade-in-down">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-4 text-base font-bold rounded-xl transition-all ${
                  pathname === link.href
                    ? "glass-card text-white"
                    : "text-gray-300 hover:text-white hover:glass-effect"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              disabled={loading}
              className="w-full text-left mt-4 glass-effect px-3 py-4 text-base font-bold text-gray-200 rounded-xl transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {loading ? "⏳ Выход..." : "👋 Выйти"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

