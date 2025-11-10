import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, "Пароль должен содержать верхний и нижний регистр, а также цифру"),
  birthDate: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  biography: z.string().max(1000).optional(),
});

export const updateInterestsSchema = z.object({
  interests: z.array(z.string()).max(20),
});

export const createEventSchema = z.object({
  interestId: z.string().min(1, "Выберите интерес"),
  title: z.string().min(3).max(255),
  description: z.string().max(2000).optional(),
  eventDate: z.string().min(1, "Укажите дату мероприятия"),
  location: z.string().min(3).max(255),
  ticketPrice: z.number().min(0),
  maxGuests: z.number().min(1).max(100),
});

export const addGuestSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

export const feedFilterSchema = z.object({
  city: z.string().optional(),
  interestId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
