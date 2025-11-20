"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Guest {
  id: string;
  userId: string;
  name: string;
  email: string;
  paymentStatus?: string;
  ticketNumber?: string;
}

interface EventDetails {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  ticketPrice: string;
  maxGuests: number;
  inviteCode?: string;
  status: string;
  host: {
    id: string;
    name: string;
    email: string;
    city?: string;
  };
  interest: {
    id: string;
    name: string;
  };
  guests: Guest[];
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialInvite = useMemo(() => searchParams.get("invite"), [searchParams]);

  useEffect(() => {
    if (initialInvite) {
      setInviteCode(initialInvite);
    }
  }, [initialInvite]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (!response.ok) {
        throw new Error("Не удалось загрузить мероприятие");
      }
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleJoin = async () => {
    setJoining(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/events/${params.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Не удалось присоединиться");
      }
      setMessage("✅ Вы успешно присоединились! Теперь оплатите билет.");
      await fetchEvent();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка присоединения");
    } finally {
      setJoining(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: params.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Не удалось создать платеж");
      }

      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        setError("Не удалось получить ссылку на оплату");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка оплаты");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-300">⏳ Загрузка...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card p-8">
          <div className="text-lg text-red-400">❌ Мероприятие не найдено</div>
        </div>
      </div>
    );
  }

  const isHost = Boolean(event.inviteCode);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-card p-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-400">
                {event.interest.name}
              </p>
              <h1 className="mt-2 text-4xl font-black text-white">
                {event.title}
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                🎉 Организатор: <span className="text-purple-400 font-semibold">{event.host.name}</span>
              </p>
            </div>
            <div className="glass-effect rounded-2xl border border-white/20 px-6 py-4 text-right text-sm text-gray-300">
              <p className="mb-2">
                📅 {new Date(event.eventDate).toLocaleString("ru-RU", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
              <p className="mb-2">📍 {event.location}</p>
              <p className="text-lg font-bold text-gradient">{event.ticketPrice} ₽</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Описание</h2>
            <p className="leading-relaxed">{event.description || "Организатор пока не добавил описание, но обещает, что будет весело 🎊"}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Участники ({event.guests.length}/{event.maxGuests})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {event.guests.map((guest) => (
                <div key={guest.id} className="glass-effect rounded-xl border border-white/10 p-4 text-sm">
                  <p className="font-bold text-white">{guest.name}</p>
                  <p className="text-gray-400 text-xs">{guest.email}</p>
                  {guest.paymentStatus && (
                    <p
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        guest.paymentStatus === "paid"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {guest.paymentStatus === "paid" ? "✅ Оплачено" : "⏳ Ожидание"}
                    </p>
                  )}
                  {guest.ticketNumber && (
                    <p className="mt-2 text-xs text-gray-500 font-mono">{guest.ticketNumber}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isHost && (
            <div className="space-y-4 glass-card p-6 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold text-gradient">
                🎊 Присоединиться к вечеринке
              </h2>
              <p className="text-sm text-gray-300">
                Введите код приглашения, полученный от организатора, и подтвердите своё участие.
              </p>
              <Input
                label="Код приглашения"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Например, a1b2c3d4"
                required
              />
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleJoin} disabled={joining || !inviteCode} glow>
                  {joining ? "⏳ Присоединяем..." : "✨ Присоединиться"}
                </Button>
                <Button variant="liquid" onClick={handlePayment} disabled={paying}>
                  {paying ? "⏳ Создаём платёж..." : "💳 Оплатить участие"}
                </Button>
              </div>
            </div>
          )}

          {event.inviteCode && (
            <div className="space-y-3 glass-card p-6 border-2 border-cyan-500/30">
              <h2 className="text-2xl font-bold text-white">
                📲 Поделитесь приглашением
              </h2>
              <p className="text-sm text-gray-300">
                Скопируйте ссылку и отправьте друзьям в мессенджеры:
              </p>
              <div className="glass-effect rounded-xl border border-white/20 p-4 text-sm text-gray-300 break-all font-mono">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/events/${event.id}?invite=${event.inviteCode}`
                  : `Ссылка доступна после загрузки страницы`}
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/events/${event.id}?invite=${event.inviteCode}`
                  );
                  setMessage("📋 Ссылка скопирована!");
                }}
              >
                📋 Скопировать ссылку
              </Button>
            </div>
          )}

          {message && (
            <div className="glass-effect rounded-xl bg-green-500/20 border border-green-500/30 p-4 text-sm text-green-200">
              {message}
            </div>
          )}
          {error && (
            <div className="glass-effect rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
