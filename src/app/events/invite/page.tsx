"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";

interface InviteEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  ticketPrice: string;
  maxGuests: number;
  currentGuests: number;
  status: string;
  host: {
    id: string;
    name: string;
    city?: string;
  };
  interest: {
    id: string;
    name: string;
  };
}

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<InviteEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Код приглашения отсутствует");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const response = await fetch(`/api/events/invite?code=${code}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Не удалось найти приглашение");
        }
        setEvent(data.event);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ошибка");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Загрузка...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-lg bg-red-50 px-6 py-4 text-red-700">
          {error || "Приглашение не найдено"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-500">
              Приглашение на мероприятие
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {event.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Организатор: {event.host.name}
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <p>Тема: {event.interest.name}</p>
            <p>
              Дата: {new Date(event.eventDate).toLocaleString("ru-RU", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
            <p>Локация: {event.location}</p>
            <p>
              Гостей: {event.currentGuests} / {event.maxGuests}
            </p>
            <p>Стоимость билета: {event.ticketPrice} ₽</p>
          </div>

          <p className="text-base text-slate-700">
            {event.description || "Организатор пока не добавил описание."}
          </p>

          <Button onClick={() => router.push(`/events/${event.id}?invite=${searchParams.get("code")}`)}>
            Присоединиться к событию
          </Button>
        </div>
      </div>
    </div>
  );
}
