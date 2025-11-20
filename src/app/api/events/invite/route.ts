import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Код приглашения не указан" },
        { status: 400 }
      );
    }

    const event = await db.query.events.findFirst({
      where: eq(events.inviteCode, code),
      with: {
        host: {
          columns: {
            id: true,
            name: true,
            city: true,
          },
        },
        interest: true,
        guests: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Приглашение не найдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        ticketPrice: event.ticketPrice,
        maxGuests: event.maxGuests,
        currentGuests: event.guests.length,
        status: event.status,
        host: event.host,
        interest: event.interest,
      },
    });
  } catch (error) {
    console.error("Failed to get invite", error);
    return NextResponse.json(
      { error: "Не удалось получить приглашение" },
      { status: 500 }
    );
  }
}
