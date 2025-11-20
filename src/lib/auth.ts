import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "dr12_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

export type SessionTokenPayload = {
  userId: string;
};

export const createSessionToken = (payload: SessionTokenPayload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS });
};

export const verifySessionToken = (token: string): SessionTokenPayload | null => {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionTokenPayload;
  } catch (error) {
    console.error("Failed to verify session token", error);
    return null;
  }
};

export const setSessionCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
};

export const clearSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const getSession = async (): Promise<SessionTokenPayload | null> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) {
    return null;
  }
  return verifySessionToken(sessionToken);
};
