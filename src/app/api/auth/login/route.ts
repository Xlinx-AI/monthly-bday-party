import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const token = createSessionToken({ userId: user.id });
    setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Failed to login", error);
    return NextResponse.json(
      { error: "Не удалось выполнить вход" },
      { status: 500 }
    );
  }
}
