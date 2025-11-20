declare module "yookassa" {
  export interface ICreatePayment {
    amount: {
      value: string;
      currency: string;
    };
    payment_method_data: {
      type: string;
    };
    confirmation: {
      type: string;
      return_url: string;
    };
    description?: string;
    metadata?: Record<string, string | number | undefined>;
    receipt?: {
      customer?: {
        email?: string | null;
      };
      items?: Array<{
        description: string;
        quantity: string;
        amount: {
          value: string;
          currency: string;
        };
        vat_code?: number;
      }>;
    };
    capture?: boolean;
  }

  export interface YooCheckoutConfig {
    shopId: string;
    secretKey: string;
  }

  export interface PaymentConfirmation {
    confirmation_url?: string;
  }

  export interface PaymentResponse {
    id: string;
    status: string;
    amount: {
      value: string;
      currency: string;
    };
    confirmation?: PaymentConfirmation;
  }

  export class YooCheckout {
    constructor(config: YooCheckoutConfig);
    createPayment(
      payload: ICreatePayment,
      idempotenceKey: string
    ): Promise<PaymentResponse>;
  }
}
