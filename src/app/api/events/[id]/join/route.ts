import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventGuests, events } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { generateId, generateTicketNumber } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Требуется код приглашения" },
        { status: 400 }
      );
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, params.id),
      with: {
        guests: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    if (event.inviteCode !== inviteCode) {
      return NextResponse.json(
        { error: "Неверный код приглашения" },
        { status: 403 }
      );
    }

    if (event.hostUserId === session.userId) {
      return NextResponse.json(
        { error: "Организатор не может записаться как гость" },
        { status: 400 }
      );
    }

    if (event.guests.some((guest) => guest.userId === session.userId)) {
      return NextResponse.json(
        { error: "Вы уже зарегистрированы на мероприятие" },
        { status: 409 }
      );
    }

    if (event.guests.length >= event.maxGuests) {
      return NextResponse.json(
        { error: "Все места заняты" },
        { status: 409 }
      );
    }

    const ticketNumber = generateTicketNumber();

    await db.insert(eventGuests).values({
      id: generateId(),
      eventId: event.id,
      userId: session.userId,
      ticketNumber,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      guest: {
        userId: session.userId,
        ticketNumber,
      },
    });
  } catch (error) {
    console.error("Failed to join event", error);
    return NextResponse.json(
      { error: "Не удалось присоединиться к мероприятию" },
      { status: 500 }
    );
  }
}
