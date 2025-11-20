import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq, gte, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const interestId = searchParams.get("interestId");

    const now = new Date();

    const filters = [gte(events.eventDate, now)];

    if (city) {
      filters.push(sql`${events.location} ILIKE ${`%${city}%`}`);
    }

    if (interestId) {
      filters.push(eq(events.interestId, interestId));
    }

    const where = filters.length > 1 ? and(...filters) : filters[0];

    const upcomingEvents = await db.query.events.findMany({
      where,
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
      orderBy: (events, { asc }) => [asc(events.eventDate)],
      limit: 20,
    });

    return NextResponse.json({
      events: upcomingEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        ticketPrice: event.ticketPrice,
        maxGuests: event.maxGuests,
        currentGuests: event.guests.length,
        status: event.status,
        host: {
          id: event.host.id,
          name: event.host.name,
          city: event.host.city,
        },
        interest: {
          id: event.interest.id,
          name: event.interest.name,
        },
      })),
    });
  } catch (error) {
    console.error("Failed to fetch events feed", error);
    return NextResponse.json(
      { error: "Не удалось получить ленту событий" },
      { status: 500 }
    );
  }
}
