import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventGuests, events, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { MOCK_ENABLED, MockYooKassa, logMockPayment } from "@/lib/payment-mock";
import { YooCheckout, ICreatePayment } from "yookassa";

const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;

type PaymentClient = {
  createPayment: (
    payload: ICreatePayment,
    idempotenceKey: string
  ) => Promise<{
    id: string;
    status: string;
    confirmation?: {
      confirmation_url?: string;
    };
  }>;
};

let checkout: PaymentClient | null = null;

if (MOCK_ENABLED) {
  checkout = new MockYooKassa({ shopId: shopId || "mock_shop", secretKey: secretKey || "mock_secret" });
} else if (shopId && secretKey) {
  const realCheckout = new YooCheckout({ shopId, secretKey });
  checkout = {
    createPayment: (payload, idempotenceKey) => realCheckout.createPayment(payload, idempotenceKey),
  };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (!checkout) {
      return NextResponse.json(
        { error: "Платежный провайдер не настроен" },
        { status: 500 }
      );
    }

    const { eventId } = await request.json();

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        host: {
          columns: {
            name: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Мероприятие не найдено" },
        { status: 404 }
      );
    }

    const guest = await db.query.eventGuests.findFirst({
      where: and(
        eq(eventGuests.eventId, eventId),
        eq(eventGuests.userId, session.userId)
      ),
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Вы не зарегистрированы на мероприятие" },
        { status: 404 }
      );
    }

    if (guest.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Вы уже оплатили участие" },
        { status: 409 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
        email: true,
      },
    });

    const amountInRubles = parseFloat(event.ticketPrice);

    const idempotenceKey = `${guest.id}-${Date.now()}`;

    const paymentPayload: ICreatePayment = {
      amount: {
        value: amountInRubles.toFixed(2),
        currency: "RUB",
      },
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/events/${eventId}?payment=success`,
      },
      description: `Билет на "${event.title}" от ${event.host.name}`,
      metadata: {
        eventId: event.id,
        guestId: guest.id,
        userId: session.userId,
        ticketNumber: guest.ticketNumber,
      },
      receipt: {
        customer: {
          email: user?.email,
        },
        items: [
          {
            description: `Билет на мероприятие "${event.title}"`,
            quantity: "1",
            amount: {
              value: amountInRubles.toFixed(2),
              currency: "RUB",
            },
            vat_code: 1,
          },
        ],
      },
      capture: true,
    };

    logMockPayment("Creating payment", paymentPayload);

    const payment = await checkout.createPayment(paymentPayload, idempotenceKey);

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      amount: amountInRubles,
      status: payment.status,
      mock: MOCK_ENABLED,
    });
  } catch (error) {
    console.error("Failed to create payment", error);
    return NextResponse.json(
      { error: "Не удалось создать платеж" },
      { status: 500 }
    );
  }
}
