import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { eventGuests } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
    })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: "Stripe не настроен" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Отсутствует подпись Stripe" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const { guestId } = paymentIntent.metadata;

      if (guestId) {
        await db
          .update(eventGuests)
          .set({ paymentStatus: "paid", updatedAt: new Date() })
          .where(eq(eventGuests.id, guestId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json(
      { error: "Ошибка обработки вебхука" },
      { status: 500 }
    );
  }
}
