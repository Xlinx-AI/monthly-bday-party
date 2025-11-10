import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, birthDate, phone, city } = parsed.data;

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const id = generateId();
    const passwordHash = await hashPassword(password);
    const birthDateValue = new Date(birthDate);

    if (Number.isNaN(birthDateValue.getTime())) {
      return NextResponse.json(
        { error: "Некорректная дата рождения" },
        { status: 400 }
      );
    }

    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
      birthDate: birthDateValue,
      phone,
      city,
    });

    const token = createSessionToken({ userId: id });
    setSessionCookie(token);

    return NextResponse.json(
      {
        user: {
          id,
          name,
          email,
          birthDate,
          phone,
          city,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register user", error);
    return NextResponse.json(
      { error: "Не удалось создать пользователя" },
      { status: 500 }
    );
  }
}
