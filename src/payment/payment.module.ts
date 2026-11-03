import { Module } from '@nestjs/common';

import { PAYMENT_REPOSITORY } from 'src/payment/application/ports/payment.repository.port';
import { DrizzlePaymentRepository } from 'src/payment/infrastructure/adapters/drizzle-payment.repository';

import { PAYMENT_GATEWAY } from 'src/payment/application/ports/payment.gateway.port';
import { StripePaymentAdapter } from 'src/payment/infrastructure/adapters/stripe-payment.adapter';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
  ],
})
export class PaymentModule {}
