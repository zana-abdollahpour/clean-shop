import { Money } from 'src/shared/domain/value-objects/money.vo';

export interface CheckoutUrls {
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResult {
  url: string;
  sessionId: string;
}

export interface PaymentGatewayPort {
  createCheckoutSession(
    amount: Money,
    metadata: { orderId: string; paymentId: string },
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult>;

  constructWebhookEvent(payload: Buffer, signature: string): any;
}
