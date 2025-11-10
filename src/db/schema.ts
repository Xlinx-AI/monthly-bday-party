import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  date,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  passwordHash: text("password_hash").notNull(),
  birthDate: date("birth_date").notNull(),
  biography: text("biography"),
  city: varchar("city", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const interests = pgTable("interests", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = typeof interests.$inferInsert;

export const userInterests = pgTable(
  "user_interests",
  {
    userId: varchar("user_id", { length: 36 }).notNull(),
    interestId: varchar("interest_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.interestId] }),
  })
);

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = typeof userInterests.$inferInsert;

export const events = pgTable("events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  hostUserId: varchar("host_user_id", { length: 36 }).notNull(),
  interestId: varchar("interest_id", { length: 36 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date", { withTimezone: false }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  ticketPrice: numeric("ticket_price", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  inviteCode: varchar("invite_code", { length: 16 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("planned"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const eventGuests = pgTable("event_guests", {
  id: varchar("id", { length: 36 }).primaryKey(),
  eventId: varchar("event_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 32 }).notNull().default("pending"),
  ticketNumber: varchar("ticket_number", { length: 32 }).notNull(),
  qrCodeData: text("qr_code_data"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type EventGuest = typeof eventGuests.$inferSelect;
export type InsertEventGuest = typeof eventGuests.$inferInsert;

export const userRelations = relations(users, ({ many }) => ({
  interests: many(userInterests),
  events: many(events),
  guestEvents: many(eventGuests),
}));

export const interestRelations = relations(interests, ({ many }) => ({
  userInterests: many(userInterests),
  events: many(events),
}));

export const userInterestRelations = relations(userInterests, ({ one }) => ({
  user: one(users, {
    fields: [userInterests.userId],
    references: [users.id],
  }),
  interest: one(interests, {
    fields: [userInterests.interestId],
    references: [interests.id],
  }),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  host: one(users, {
    fields: [events.hostUserId],
    references: [users.id],
  }),
  interest: one(interests, {
    fields: [events.interestId],
    references: [interests.id],
  }),
  guests: many(eventGuests),
}));

export const eventGuestRelations = relations(eventGuests, ({ one }) => ({
  event: one(events, {
    fields: [eventGuests.eventId],
    references: [events.id],
  }),
  guest: one(users, {
    fields: [eventGuests.userId],
    references: [users.id],
  }),
}));
