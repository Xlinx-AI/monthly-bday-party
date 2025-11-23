CREATE TABLE "event_guests" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"event_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"payment_status" varchar(32) DEFAULT 'pending' NOT NULL,
	"ticket_number" varchar(32) NOT NULL,
	"qr_code_data" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"host_user_id" varchar(36) NOT NULL,
	"interest_id" varchar(36) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"event_date" timestamp NOT NULL,
	"location" varchar(255) NOT NULL,
	"ticket_price" numeric(10, 2) NOT NULL,
	"max_guests" integer NOT NULL,
	"invite_code" varchar(16) NOT NULL,
	"status" varchar(32) DEFAULT 'planned' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_interests" (
	"user_id" varchar(36) NOT NULL,
	"interest_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_interests_user_id_interest_id_pk" PRIMARY KEY("user_id","interest_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(32),
	"password_hash" text NOT NULL,
	"birth_date" date NOT NULL,
	"biography" text,
	"city" varchar(120),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "event_guests_event_idx" ON "event_guests" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_guests_user_idx" ON "event_guests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_host_idx" ON "events" USING btree ("host_user_id");--> statement-breakpoint
CREATE INDEX "events_interest_idx" ON "events" USING btree ("interest_id");--> statement-breakpoint
CREATE INDEX "events_date_idx" ON "events" USING btree ("event_date");