"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/ui/Navigation";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface EventCard {
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

export default function EventsPage() {
  const [events, setEvents] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [interestId, setInterestId] = useState("");

  const fetchEvents = async (filters?: { city?: string; interestId?: string }) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters?.city) params.set("city", filters.city);
    if (filters?.interestId) params.set("interestId", filters.interestId);

    const response = await fetch(`/api/events/feed?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setEvents(data.events || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Лента мероприятий
            </h1>
            <p className="mt-2 text-slate-600">
              Подбираем события по интересам и городу
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <Input
            label="Город"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Москва"
          />
          <Input
            label="ID интереса (необязательно)"
            name="interestId"
            value={interestId}
            onChange={(e) => setInterestId(e.target.value)}
            placeholder="Например, 123"
          />
          <div className="mt-7 flex gap-3">
            <Button
              onClick={() => fetchEvents({ city, interestId })}
              className="flex-1"
            >
              Применить
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCity("");
                setInterestId("");
                fetchEvents();
              }}
            >
              Сбросить
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-600">Загружаем события...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <p className="text-lg text-slate-600">Нет запланированных мероприятий</p>
            <p className="mt-2 text-sm text-slate-500">
              Попробуйте изменить фильтры или загляните позже
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {event.interest.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    {event.status}
                  </span>
                </div>

                <p className="mb-3 line-clamp-3 text-sm text-slate-600">
                  {event.description || "Организатор не добавил описание"}
                </p>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>📅 {new Date(event.eventDate).toLocaleDateString("ru-RU", { dateStyle: "full" })}</p>
                  <p>📍 {event.location}</p>
                  <p>👥 {event.currentGuests} / {event.maxGuests} гостей</p>
                  <p>💰 {event.ticketPrice} ₽</p>
                  <p>🎉 Именинник: {event.host.name}</p>
                </div>

                <div className="mt-6 flex justify-between">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-500"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
