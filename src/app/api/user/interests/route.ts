import { NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { updateInterestsSchema } from "@/lib/validation";
import { interests as interestsTable, userInterests } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const [availableInterests, userInterestsList] = await Promise.all([
      db.select().from(interestsTable).orderBy(interestsTable.name),
      db.query.userInterests.findMany({
        where: eq(userInterests.userId, session.userId),
        with: {
          interest: true,
        },
      }),
    ]);

    return NextResponse.json({
      interests: availableInterests,
      userInterests: userInterestsList.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch interests", error);
    return NextResponse.json(
      { error: "Не удалось получить интересы" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const parsed = updateInterestsSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const rawNames = parsed.data.interests
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const uniqueNames = Array.from(new Set(rawNames.map((name) => name.toLowerCase())));

    if (uniqueNames.length === 0) {
      await db.delete(userInterests).where(eq(userInterests.userId, session.userId));
      return NextResponse.json({ interests: [] });
    }

    const existing = await db
      .select()
      .from(interestsTable)
      .where(inArray(interestsTable.name, uniqueNames));

    const missingNames = uniqueNames.filter(
      (name) => !existing.some((interest) => interest.name.toLowerCase() === name)
    );

    if (missingNames.length > 0) {
      await db.insert(interestsTable).values(
        missingNames.map((name) => ({
          id: generateId(),
          name,
        }))
      );
    }

    const allInterests = await db
      .select()
      .from(interestsTable)
      .where(inArray(interestsTable.name, uniqueNames));

    await db.delete(userInterests).where(eq(userInterests.userId, session.userId));

    await db.insert(userInterests).values(
      allInterests.map((interest) => ({
        userId: session.userId,
        interestId: interest.id,
      }))
    );

    return NextResponse.json({
      interests: allInterests.map((interest) => ({
        id: interest.id,
        name: interest.name,
      })),
    });
  } catch (error) {
    console.error("Failed to update interests", error);
    return NextResponse.json(
      { error: "Не удалось обновить интересы" },
      { status: 500 }
    );
  }
}
