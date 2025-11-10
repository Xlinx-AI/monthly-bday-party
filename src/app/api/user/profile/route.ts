import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const parsed = updateProfileSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId));

    const updated = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    return NextResponse.json({
      user: {
        id: updated!.id,
        name: updated!.name,
        email: updated!.email,
        birthDate: updated!.birthDate,
        phone: updated!.phone,
        city: updated!.city,
        biography: updated!.biography,
      },
    });
  } catch (error) {
    console.error("Failed to update profile", error);
    return NextResponse.json(
      { error: "Не удалось обновить профиль" },
      { status: 500 }
    );
  }
}
