import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, interests } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { createEventSchema } from "@/lib/validation";
import { and, eq, gte, lte } from "drizzle-orm";
import { generateId, generateInviteCode } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const parsed = createEventSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { interestId, title, description, eventDate, location, ticketPrice, maxGuests } =
      parsed.data;

    const interest = await db.query.interests.findFirst({
      where: eq(interests.id, interestId),
      columns: { id: true },
    });

    if (!interest) {
      return NextResponse.json(
        { error: "Указанный интерес не найден" },
        { status: 404 }
      );
    }

    const eventDateValue = new Date(eventDate);

    if (Number.isNaN(eventDateValue.getTime())) {
      return NextResponse.json(
        { error: "Некорректная дата мероприятия" },
        { status: 400 }
      );
    }

    const startOfMonth = new Date(eventDateValue.getFullYear(), eventDateValue.getMonth(), 1);
    const endOfMonth = new Date(eventDateValue.getFullYear(), eventDateValue.getMonth() + 1, 0, 23, 59, 59);

    const existingEvent = await db.query.events.findFirst({
      where: and(
        eq(events.hostUserId, session.userId),
        gte(events.eventDate, startOfMonth),
        lte(events.eventDate, endOfMonth)
      ),
    });

    if (existingEvent) {
      return NextResponse.json(
        {
          error: "Вы уже создали мероприятие в этом месяце",
        },
        { status: 409 }
      );
    }

    const id = generateId();

    await db.insert(events).values({
      id,
      hostUserId: session.userId,
      interestId,
      title,
      description,
      eventDate: eventDateValue,
      location,
      ticketPrice: ticketPrice.toFixed(2),
      maxGuests,
      inviteCode: generateInviteCode(),
    });

    const createdEvent = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    return NextResponse.json({ event: createdEvent }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event", error);
    return NextResponse.json(
      { error: "Не удалось создать мероприятие" },
      { status: 500 }
    );
  }
}
