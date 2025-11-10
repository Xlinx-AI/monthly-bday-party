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
        <div className="text-lg text-slate-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          Редактировать профиль
        </h1>

        <div className="space-y-6">
          <form
            onSubmit={handleProfileUpdate}
            className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Основная информация
            </h2>

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
            />

            <Input
              label="Город"
              name="city"
              type="text"
              defaultValue={user?.city}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                О себе
              </label>
              <textarea
                name="biography"
                rows={4}
                defaultValue={user?.biography}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="Расскажите о себе..."
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить профиль"}
            </Button>
          </form>

          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Мои интересы
            </h2>

            <p className="text-sm text-slate-600">
              Укажите ваши интересы через запятую. Они будут использованы для
              создания мероприятий и подбора похожих событий.
            </p>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Интересы (через запятую)
              </label>
              <textarea
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="караоке, настольные игры, йога, программирование"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {user?.interests.map((interest) => (
                <span
                  key={interest.id}
                  className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
                >
                  {interest.name}
                </span>
              ))}
            </div>

            <Button onClick={handleInterestsUpdate} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить интересы"}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
