"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      birthDate: formData.get("birthDate") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.error === "object") {
          const errors = Object.entries(data.error)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("; ");
          throw new Error(errors);
        } else {
          throw new Error(data.error || "Ошибка регистрации");
        }
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
      <div className="w-full max-w-lg space-y-8 glass-card p-10">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gradient mb-4">
            Начните бесплатно
          </h2>
          <p className="text-gray-300 text-lg">
            Создайте аккаунт за 30 секунд
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300">
              Войти →
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Как вас зовут?"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ваше имя"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
          />

          <Input
            label="Придумайте пароль"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Минимум 8 символов"
          />

          <Input
            label="Дата рождения"
            name="birthDate"
            type="date"
            required
          />

          <Input
            label="Телефон (для уведомлений)"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
          />

          <Input
            label="Ваш город"
            name="city"
            type="text"
            placeholder="Москва"
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
            {loading ? "⏳ Создаём аккаунт..." : "🎉 Зарегистрироваться"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Регистрируясь, вы соглашаетесь с тем, что мы будем делать ваши дни рождения незабываемыми 🎂
          </p>
        </form>
      </div>
    </div>
  );
}
