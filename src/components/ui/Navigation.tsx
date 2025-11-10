"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    { href: "/dashboard", label: "Мои мероприятия" },
    { href: "/events", label: "Лента событий" },
    { href: "/profile", label: "Профиль" },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-purple-600"
            >
              MBC
            </Link>
            <div className="hidden gap-4 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition ${
                    pathname === link.href
                      ? "text-purple-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:opacity-50"
          >
            {loading ? "Выход..." : "Выйти"}
          </button>
        </div>
      </div>
    </nav>
  );
}
