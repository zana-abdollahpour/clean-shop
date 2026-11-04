import { Module } from '@nestjs/common';

import { PaymentsController } from 'src/payment/presentation/payment.controller';
import { PaymentCommandHandlers } from 'src/payment/application/use-cases';

import { PAYMENT_GATEWAY } from 'src/payment/application/ports/payment.gateway.port';
import { StripePaymentAdapter } from 'src/payment/infrastructure/adapters/stripe-payment.adapter';

import { PAYMENT_REPOSITORY } from 'src/payment/application/ports/payment.repository.port';
import { DrizzlePaymentRepository } from 'src/payment/infrastructure/adapters/drizzle-payment.repository';

import { ORDER_PRICING } from 'src/payment/application/ports/order-pricing.port';
import { OrderPricingAdapter } from 'src/payment/infrastructure/adapters/order-pricing.adapter';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [PaymentsController],
  imports: [OrderModule],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
    {
      provide: ORDER_PRICING,
      useClass: OrderPricingAdapter,
    },
    ...PaymentCommandHandlers,
  ],
})
export class PaymentModule {}
