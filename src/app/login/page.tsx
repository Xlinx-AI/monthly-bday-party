"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка авторизации");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-card p-6 sm:p-10 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gradient mb-4">
            Добро пожаловать обратно
          </h2>
          <p className="text-gray-300 text-lg">Продолжайте делать праздник ежемесячным</p>
          <p className="mt-3 text-sm text-gray-400">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-bold text-purple-400 hover:text-purple-300">
              Зарегистрируйтесь →
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
          />

          <Input
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Ваш пароль"
          />

          {error && (
            <div className="glass-effect rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
            glow
          >
            {loading ? "⏳ Вход..." : "🚀 Продолжить"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Улыбнитесь — сегодня тоже найдётся повод отпраздновать.
          </p>
        </form>
      </div>
    </div>
  );
}
