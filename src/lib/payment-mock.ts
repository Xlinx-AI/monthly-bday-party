export const MOCK_ENABLED = process.env.TWELVEDR_ENABLE_PAYMENT_MOCKS === "true";

export interface MockPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type: string;
    confirmation_url?: string;
  };
  metadata?: Record<string, string>;
}

export class MockYooKassa {
  private shopId: string;
  private secretKey: string;

  constructor(config: { shopId: string; secretKey: string }) {
    this.shopId = config.shopId;
    this.secretKey = config.secretKey;
    console.log("⚠️  MOCK MODE: YooKassa initialized in demo mode");
  }

  async createPayment(payment: any, idempotenceKey: string): Promise<MockPayment> {
    console.log("💳 MOCK: Creating payment", { payment, idempotenceKey });
    
    const mockPayment: MockPayment = {
      id: `mock_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      amount: payment.amount,
      confirmation: {
        type: "redirect",
        confirmation_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/mock-payment?payment_id=mock_${Date.now()}`,
      },
      metadata: payment.metadata,
    };

    console.log("✅ MOCK: Payment created", mockPayment);
    return mockPayment;
  }
}

export function createMockWebhookPayload(metadata: Record<string, string>, status: "succeeded" | "canceled" = "succeeded") {
  return {
    event: status === "succeeded" ? "payment.succeeded" : "payment.canceled",
    object: {
      id: `mock_payment_${Date.now()}`,
      status,
      paid: status === "succeeded",
      amount: {
        value: "1500.00",
        currency: "RUB",
      },
      metadata,
    },
  };
}

export function logMockPayment(message: string, data?: any) {
  if (MOCK_ENABLED) {
    console.log(`🎭 MOCK PAYMENT: ${message}`, data || "");
  }
}
