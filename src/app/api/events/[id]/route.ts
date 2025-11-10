import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, params.id),
      with: {
        host: {
          columns: {
            id: true,
            name: true,
            email: true,
            city: true,
          },
        },
        interest: true,
        guests: {
          with: {
            guest: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    const isHost = event.hostUserId === session.userId;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        ticketPrice: event.ticketPrice,
        maxGuests: event.maxGuests,
        inviteCode: isHost ? event.inviteCode : undefined,
        status: event.status,
        host: event.host,
        interest: event.interest,
        guests: event.guests.map((g) => ({
          id: g.id,
          userId: g.guest.id,
          name: g.guest.name,
          email: g.guest.email,
          paymentStatus: g.paymentStatus,
          ticketNumber: isHost ? g.ticketNumber : undefined,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to get event", error);
    return NextResponse.json(
      { error: "Не удалось получить мероприятие" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, params.id),
    });

    if (!event) {
      return NextResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    if (event.hostUserId !== session.userId) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      );
    }

    const payload = await request.json();

    await db
      .update(events)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(events.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update event", error);
    return NextResponse.json(
      { error: "Не удалось обновить мероприятие" },
      { status: 500 }
    );
  }
}
