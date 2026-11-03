import { Module } from '@nestjs/common';

import { PAYMENT_REPOSITORY } from 'src/payment/application/ports/payment.repository.port';
import { DrizzlePaymentRepository } from 'src/payment/infrastructure/adapters/drizzle-payment.repository';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
})
export class PaymentModule {}
