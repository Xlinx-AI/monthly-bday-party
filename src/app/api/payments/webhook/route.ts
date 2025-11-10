import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventGuests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log("YooKassa webhook received:", payload);

    const eventType = payload.event;
    const paymentObject = payload.object;

    if (eventType === "payment.succeeded" && paymentObject) {
      const { guestId } = paymentObject.metadata || {};

      if (guestId) {
        await db
          .update(eventGuests)
          .set({ 
            paymentStatus: "paid", 
            updatedAt: new Date(),
            qrCodeData: paymentObject.id,
          })
          .where(eq(eventGuests.id, guestId));

        console.log(`Payment succeeded for guest ${guestId}`);
      }
    } else if (eventType === "payment.canceled") {
      const { guestId } = paymentObject.metadata || {};
      
      if (guestId) {
        await db
          .update(eventGuests)
          .set({ 
            paymentStatus: "canceled", 
            updatedAt: new Date(),
          })
          .where(eq(eventGuests.id, guestId));

        console.log(`Payment canceled for guest ${guestId}`);
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
