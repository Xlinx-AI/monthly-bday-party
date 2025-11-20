import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const myEvents = await db.query.events.findMany({
      where: eq(events.hostUserId, session.userId),
      with: {
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
      orderBy: (events, { desc }) => [desc(events.eventDate)],
    });

    return NextResponse.json({
      events: myEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        ticketPrice: event.ticketPrice,
        maxGuests: event.maxGuests,
        inviteCode: event.inviteCode,
        status: event.status,
        interest: {
          id: event.interest.id,
          name: event.interest.name,
        },
        guests: event.guests.map((g) => ({
          id: g.id,
          userId: g.guest.id,
          name: g.guest.name,
          email: g.guest.email,
          paymentStatus: g.paymentStatus,
          ticketNumber: g.ticketNumber,
        })),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch my events", error);
    return NextResponse.json(
      { error: "Не удалось получить ваши мероприятия" },
      { status: 500 }
    );
  }
}
