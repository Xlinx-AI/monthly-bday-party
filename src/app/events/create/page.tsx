"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Interest = {
  id: string;
  name: string;
};

export default function CreateEventPage() {
  const router = useRouter();
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const response = await fetch("/api/user/interests");
        if (!response.ok) {
          router.push("/login");
          return;
        }
        const data = await response.json();
        setUserInterests(data.userInterests || []);
      } catch (error) {
        console.error("Failed to load interests", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadInterests();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      interestId: formData.get("interestId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventDate: new Date(formData.get("eventDate") as string).toISOString(),
      location: formData.get("location") as string,
      ticketPrice: parseFloat(formData.get("ticketPrice") as string),
      maxGuests: parseInt(formData.get("maxGuests") as string, 10),
    };

    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка создания мероприятия");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-white font-bold">⏳ Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gradient">
            Создать мероприятие
          </h1>
          <p className="mt-2 text-gray-300">
            Заполните информацию о вашей вечеринке
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 glass-card p-6 sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Выберите интерес <span className="text-purple-400">*</span>
            </label>
            <select
              name="interestId"
              required
              className="glass-effect w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [&>option]:bg-[#1a0b2e]"
            >
              <option value="">Выберите тему</option>
              {userInterests.length > 0 ? (
                userInterests.map((interest) => (
                  <option key={interest.id} value={interest.id}>
                    {interest.name}
                  </option>
                ))
              ) : (
                <option disabled>
                  Сначала добавьте интересы в профиле
                </option>
              )}
            </select>
            {userInterests.length === 0 && (
              <p className="mt-2 text-xs text-red-400">
                У вас нет интересов. Добавьте их в{" "}
                <Link href="/profile" className="underline hover:text-white">
                  профиле
                </Link>
                .
              </p>
            )}
          </div>

          <Input
            label="Название мероприятия"
            name="title"
            type="text"
            required
            placeholder="Вечер настольных игр"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Описание (необязательно)
            </label>
            <textarea
              name="description"
              rows={4}
              className="glass-effect w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Опишите, что ждет гостей..."
            />
          </div>

          <Input
            label="Дата и время"
            name="eventDate"
            type="datetime-local"
            required
            className="calendar-dark"
          />

          <Input
            label="Место проведения"
            name="location"
            type="text"
            required
            placeholder="Москва, ул. Пушкина, 10"
          />

          <Input
            label="Цена билета (₽)"
            name="ticketPrice"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="1500"
          />

          <Input
            label="Максимальное количество гостей"
            name="maxGuests"
            type="number"
            min="1"
            max="100"
            required
            placeholder="10"
          />

          {error && (
            <div className="glass-effect rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || userInterests.length === 0}
              glow
            >
              {loading ? "Создание..." : "Создать мероприятие"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => router.push("/dashboard")}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
