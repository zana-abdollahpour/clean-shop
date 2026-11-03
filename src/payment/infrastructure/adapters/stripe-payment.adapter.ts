import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import {
  CheckoutLineItem,
  CheckoutUrls,
  CreateCheckoutSessionResult,
  PaymentGatewayPort,
} from 'src/payment/application/ports/payment.gateway.port';

@Injectable()
export class StripePaymentAdapter implements PaymentGatewayPort {
  private readonly stripeClient: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(
    lines: CheckoutLineItem[],
    metadata: { orderId: string; paymentId: string },
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult> {
    const session = await this.stripeClient.checkout.sessions.create({
      mode: 'payment',
      success_url: urls?.cancelUrl,
      cancel_url: urls?.cancelUrl,
      metadata: {
        orderId: metadata.orderId,
        paymentId: metadata.paymentId,
      },
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: line.unitAmount.getCurrency().toLowerCase(),
          unit_amount: line.unitAmount.toCents(),
          product_data: { name: line.name },
        },
      })),
    });

    return {
      url: session.url!,
      sessionId: session.id,
    };
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripeClient.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
