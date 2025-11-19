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
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card p-8">
          <div className="text-xl text-white font-bold">⏳ Загрузка...</div>
        </div>
      </div>
    );
  }

  const inviteUrl = (code: string) =>
    origin ? `${origin}/events/invite?code=${code}` : "";

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 glass-card p-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-gradient mb-2">
              Привет, {user?.name}! 🎉
            </h1>
            <p className="text-gray-300 text-lg">
              Ваших интересов: <span className="text-purple-400 font-bold">{user?.interests.length || 0}</span>
            </p>
          </div>
          <Link href="/events/create">
            <Button size="lg" glow>🎊 Создать мероприятие</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span>Мои мероприятия</span>
            <span className="text-xl text-gray-400">({events.length})</span>
          </h2>

          {events.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">🎈</div>
              <p className="text-2xl font-bold text-white mb-3">
                У вас пока нет мероприятий
              </p>
              <p className="text-gray-300 mb-6">
                Создайте первое мероприятие и пригласите друзей отпраздновать день рождения вместе!
              </p>
              <Link href="/events/create">
                <Button glow>✨ Создать первое событие</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="glass-card p-6 group hover:scale-[1.02] transition-transform"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-gradient transition-all">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-purple-300 font-semibold">
                        🏷️ {event.interest.name}
                      </p>
                    </div>
                    <span className="rounded-full glass-effect px-4 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/30">
                      {event.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>{new Date(event.eventDate).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <span>Гостей: <span className="text-purple-400 font-bold">{event.guests.length}</span> / {event.maxGuests}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span>Цена билета: <span className="text-cyan-400 font-bold">{event.ticketPrice} ₽</span></span>
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="glass-effect rounded-xl p-4">
                      <p className="mb-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        🔗 Пригласительная ссылка:
                      </p>
                      <p className="break-all text-xs text-gray-400 mb-2 font-mono">
                        {inviteUrl(event.inviteCode)}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(inviteUrl(event.inviteCode));
                          alert("✅ Ссылка скопирована!");
                        }}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        📋 Скопировать ссылку
                      </button>
                    </div>

                    {event.guests.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-bold text-white">
                          👥 Список гостей:
                        </p>
                        <ul className="space-y-2">
                          {event.guests.map((guest) => (
                            <li
                              key={guest.id}
                              className="flex items-center justify-between text-xs glass-effect rounded-lg p-2"
                            >
                              <span className="text-gray-200 font-medium">{guest.name}</span>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  guest.paymentStatus === "paid"
                                    ? "bg-green-500/20 text-green-300 border border-green-400/30"
                                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                                }`}
                              >
                                {guest.paymentStatus === "paid"
                                  ? "✅ Оплачено"
                                  : "⏳ Ожидание"}
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
