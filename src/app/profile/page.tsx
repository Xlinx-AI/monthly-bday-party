"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type User = {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  phone?: string;
  city?: string;
  biography?: string;
  interests: Array<{ id: string; name: string }>;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [interestsInput, setInterestsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/login");
          return;
        }
        const data = await response.json();
        setUser(data.user);
        setInterestsInput(data.user.interests.map((i: { name: string }) => i.name).join(", "));
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      biography: formData.get("biography") as string,
    };

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления профиля");
      }

      setSuccessMessage("Профиль успешно обновлен");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleInterestsUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    const interests = interestsInput
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      const response = await fetch("/api/user/interests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления интересов");
      }

      const data = await response.json();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              interests: data.interests,
            }
          : null
      );
      setSuccessMessage("Интересы успешно обновлены");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card p-8">
          <div className="text-xl text-white font-bold">⏳ Загружаем профиль...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="glass-card p-6 sm:p-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gradient mb-3">Ваш профиль 12DR</h1>
          <p className="text-lg text-gray-300">
            Управляйте данными, добавляйте интересы и делайте каждый месяц праздником.
          </p>
        </div>

        <form onSubmit={handleProfileUpdate} className="glass-card p-6 sm:p-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Основная информация</h2>
            <p className="text-sm text-gray-400">
              Эти данные используют гости, чтобы лучше познакомиться с вами до мероприятия.
            </p>
          </div>

          <Input
            label="Имя"
            name="name"
            type="text"
            defaultValue={user?.name}
            required
          />

          <Input
            label="Email (нельзя изменить)"
            name="email"
            type="email"
            defaultValue={user?.email}
            disabled
          />

          <Input
            label="Дата рождения (нельзя изменить)"
            name="birthDate"
            type="date"
            defaultValue={user?.birthDate}
            disabled
          />

          <Input
            label="Телефон"
            name="phone"
            type="tel"
            defaultValue={user?.phone}
            placeholder="+7 (999) 123-45-67"
          />

          <Input
            label="Город"
            name="city"
            type="text"
            defaultValue={user?.city}
            placeholder="Москва"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              О себе
            </label>
            <textarea
              name="biography"
              rows={4}
              defaultValue={user?.biography}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              placeholder="Расскажите о себе, любимых занятиях и форматах отдыха"
            />
          </div>

          <Button type="submit" disabled={saving} glow>
            {saving ? "Сохраняем..." : "💾 Сохранить профиль"}
          </Button>
        </form>

        <div className="glass-card p-6 sm:p-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Интересы</h2>
            <p className="text-sm text-gray-400">
              Укажите до 20 интересов — мы используем их для рекомендаций и темы ваших 12DR событий.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Интересы (через запятую)
            </label>
            <textarea
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              placeholder="караоке, настольные игры, йога, программирование"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.interests.map((interest) => (
              <span
                key={interest.id}
                className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-1 text-sm font-semibold text-purple-200"
              >
                {interest.name}
              </span>
            ))}
          </div>

          <Button onClick={handleInterestsUpdate} disabled={saving} glow type="button">
            {saving ? "Обновляем..." : "✨ Сохранить интересы"}
          </Button>
        </div>

        {(error || successMessage) && (
          <div className="glass-card p-6">
            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mt-4 rounded-2xl border border-green-500/40 bg-green-500/15 px-4 py-3 text-sm text-green-100">
                {successMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
