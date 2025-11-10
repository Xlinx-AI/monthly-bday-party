import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return randomBytes(16).toString("hex");
}

export function generateInviteCode(): string {
  return randomBytes(8).toString("hex");
}

export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `MBC-${timestamp}-${random}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(num);
}

export function canCreateEventThisMonth(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  const birthDay = birth.getDate();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const eventDayThisMonth = new Date(currentYear, currentMonth, birthDay);
  
  return currentDay === birthDay || (currentDay < birthDay && eventDayThisMonth >= today);
}
