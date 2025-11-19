import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
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

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      with: {
        interests: {
          with: {
            interest: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        phone: user.phone,
        city: user.city,
        biography: user.biography,
        interests: user.interests.map((ui) => ({
          id: ui.interest.id,
          name: ui.interest.name,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to get user info", error);
    return NextResponse.json(
      { error: "Не удалось получить информацию о пользователе" },
      { status: 500 }
    );
  }
}
