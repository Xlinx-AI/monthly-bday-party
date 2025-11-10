"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  ticketPrice: string;
  maxGuests: number;
  inviteCode: string;
  status: string;
  interest: {
    id: string;
    name: string;
  };
  guests: Array<{
    id: string;
    userId: string;
    name: string;
    email: string;
    paymentStatus: string;
    ticketNumber: string;
  }>;
};

type User = {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  interests: Array<{ id: string; name: string }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meRes, eventsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/events/my"),
        ]);

        if (!meRes.ok) {
          router.push("/login");
          return;
        }

        const [meData, eventsData] = await Promise.all([
          meRes.json(),
          eventsRes.json(),
        ]);

        setUser(meData.user);
        setEvents(eventsData.events || []);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Загрузка...</div>
      </div>
    );
  }

  const inviteUrl = (code: string) =>
    origin ? `${origin}/events/invite?code=${code}` : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Привет, {user?.name}!
            </h1>
            <p className="mt-2 text-slate-600">
              Ваших интересов: {user?.interests.length || 0}
            </p>
          </div>
          <Link href="/events/create">
            <Button size="lg">Создать мероприятие</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Мои мероприятия
          </h2>

          {events.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <p className="text-lg text-slate-600">
                У вас пока нет мероприятий
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Создайте первое мероприятие и пригласите друзей!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {event.interest.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      {event.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>📅 {new Date(event.eventDate).toLocaleDateString("ru-RU")}</p>
                    <p>📍 {event.location}</p>
                    <p>
                      👥 Гостей: {event.guests.length} / {event.maxGuests}
                    </p>
                    <p>💰 Цена билета: {event.ticketPrice} ₽</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="mb-1 text-xs font-medium text-slate-700">
                        Пригласительная ссылка:
                      </p>
                      <p className="break-all text-xs text-slate-600">
                        {inviteUrl(event.inviteCode)}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(inviteUrl(event.inviteCode));
                          alert("Ссылка скопирована!");
                        }}
                        className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-500"
                      >
                        Скопировать
                      </button>
                    </div>

                    {event.guests.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">
                          Список гостей:
                        </p>
                        <ul className="space-y-1">
                          {event.guests.map((guest) => (
                            <li
                              key={guest.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <span>{guest.name}</span>
                              <span
                                className={`rounded-full px-2 py-1 ${
                                  guest.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {guest.paymentStatus === "paid"
                                  ? "Оплачено"
                                  : "Ожидание"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
