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
  const [paymentSecret, setPaymentSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialInvite = useMemo(() => searchParams.get("invite"), [searchParams]);

  useEffect(() => {
    if (initialInvite) {
      setInviteCode(initialInvite);
    }
  }, [initialInvite]);

  useEffect(() => {
    const loadEvent = async () => {
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
    loadEvent();
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
      setMessage("Вы успешно присоединились! Перейдите к оплате.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка присоединения");
    } finally {
      setJoining(false);
    }
  };

  const handleCreatePaymentIntent = async () => {
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

      setPaymentSecret(data.clientSecret);
      setMessage(
        "Платеж инициирован. Используйте Stripe Elements на фронтенде для завершения оплаты."
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка оплаты");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-slate-600">Загрузка...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">Мероприятие не найдено</div>
      </div>
    );
  }

  const isHost = Boolean(event.inviteCode);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-500">
                {event.interest.name}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {event.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Организатор: {event.host.name}
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 px-4 py-2 text-right text-sm text-slate-600">
              <p>
                Дата: {new Date(event.eventDate).toLocaleString("ru-RU", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
              <p>Место: {event.location}</p>
              <p>Билет: {event.ticketPrice} ₽</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600">
            <h2 className="text-xl font-semibold text-slate-900">Описание</h2>
            <p>{event.description || "Организатор пока не добавил описание."}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Участники ({event.guests.length}/{event.maxGuests})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {event.guests.map((guest) => (
                <div key={guest.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{guest.name}</p>
                  <p className="text-slate-500">{guest.email}</p>
                  {guest.paymentStatus && (
                    <p
                      className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        guest.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {guest.paymentStatus === "paid" ? "Оплачено" : "Ожидание оплаты"}
                    </p>
                  )}
                  {guest.ticketNumber && (
                    <p className="mt-2 text-xs text-slate-500">{guest.ticketNumber}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isHost && (
            <div className="space-y-4 rounded-xl border border-dashed border-purple-200 bg-purple-50 p-6">
              <h2 className="text-xl font-semibold text-purple-700">
                Присоединиться к вечеринке
              </h2>
              <p className="text-sm text-purple-700">
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
                <Button onClick={handleJoin} disabled={joining || !inviteCode}>
                  {joining ? "Присоединяем..." : "Присоединиться"}
                </Button>
                <Button variant="outline" onClick={handleCreatePaymentIntent}>
                  Оплатить участие
                </Button>
              </div>
              {paymentSecret && (
                <div className="rounded-lg bg-white p-4 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Client secret:</p>
                  <p className="break-all">{paymentSecret}</p>
                  <p className="mt-2">
                    Используйте его с Stripe Elements или мобильным SDK для завершения платежа.
                  </p>
                </div>
              )}
            </div>
          )}

          {event.inviteCode && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Поделитесь приглашением
              </h2>
              <p className="text-sm text-slate-600">
                Отправьте друзьям ссылку для участия:
              </p>
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="break-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/events/${event.id}?invite=${event.inviteCode}`
                    : `Ссылка доступна после загрузки страницы`}
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
