import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventGuests, events } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
    })
  : null;

export async function POST(request: Request) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Платежный провайдер не настроен" },
        { status: 500 }
      );
    }

    const { eventId } = await request.json();

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    const guest = await db.query.eventGuests.findFirst({
      where: and(
        eq(eventGuests.eventId, eventId),
        eq(eventGuests.userId, session.userId)
      ),
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Вы не зарегистрированы на мероприятие" },
        { status: 404 }
      );
    }

    if (guest.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Вы уже оплатили участие" },
        { status: 409 }
      );
    }

    const amountInRubles = parseFloat(event.ticketPrice);
    const amountInKopeks = Math.round(amountInRubles * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInKopeks,
      currency: "rub",
      metadata: {
        eventId: event.id,
        guestId: guest.id,
        userId: session.userId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInRubles,
    });
  } catch (error) {
    console.error("Failed to create payment intent", error);
    return NextResponse.json(
      { error: "Не удалось создать платеж" },
      { status: 500 }
    );
  }
}
