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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-sky-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500">
              Войти
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Имя"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Иван Иванов"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="ivan@example.com"
          />

          <Input
            label="Пароль"
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
            label="Телефон (необязательно)"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
          />

          <Input
            label="Город (необязательно)"
            name="city"
            type="text"
            placeholder="Москва"
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </div>
    </div>
  );
}
