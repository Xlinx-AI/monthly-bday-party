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
    const loadInitialEvents = async () => {
      const params = new URLSearchParams();
      const response = await fetch(`/api/events/feed?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
      setLoading(false);
    };
    void loadInitialEvents();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-gradient">
              Лента мероприятий
            </h1>
            <p className="mt-2 text-gray-300">
              Подбираем события по интересам и городу
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl glass-card p-6 md:grid-cols-3">
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
              glow
            >
              Применить
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
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
          <div className="flex h-40 items-center justify-center rounded-2xl glass-effect">
            <span className="text-gray-300">Загружаем события...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl glass-card p-12 text-center">
            <p className="text-xl text-white font-bold">Нет запланированных мероприятий</p>
            <p className="mt-2 text-sm text-gray-400">
              Попробуйте изменить фильтры или загляните позже
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl glass-card p-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white group-hover:text-gradient transition-all">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-sm text-purple-300 font-semibold">
                      🏷️ {event.interest.name}
                    </p>
                  </div>
                  <span className="rounded-full glass-effect px-4 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/30">
                    {event.status}
                  </span>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-300">
                  {event.description || "Организатор не добавил описание"}
                </p>

                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <span>📅</span>
                    {new Date(event.eventDate).toLocaleDateString("ru-RU", { dateStyle: "full" })}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>👥</span>
                    {event.currentGuests} / {event.maxGuests} гостей
                  </p>
                  <p className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-cyan-400 font-bold">{event.ticketPrice} ₽</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🎉</span>
                    Именинник: <span className="text-purple-400 font-bold">{event.host.name}</span>
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <Link
                    href={`/events/${event.id}`}
                    className="w-full"
                  >
                    <Button className="w-full" variant="secondary">
                       👀 Подробнее
                    </Button>
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
