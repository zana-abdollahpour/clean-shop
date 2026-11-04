import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { Payment } from 'src/payment/domain/entities/payment.entity';
import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';
import { CreatePaymentCommand } from 'src/payment/application/use-cases/create-payment/create-payment.command';

import {
  ORDER_PRICING,
  OrderPricingPort,
} from 'src/payment/application/ports/order-pricing.port';

import {
  PAYMENT_REPOSITORY,
  PaymentRepositoryPort,
} from 'src/payment/application/ports/payment.repository.port';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from 'src/payment/application/ports/payment.gateway.port';

export interface CreatePaymentResponse {
  paymentId: string;
  checkoutUrl: string;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<
  CreatePaymentCommand,
  CreatePaymentResponse
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepositoryPort,
    @Inject(ORDER_PRICING)
    private readonly orderPricing: OrderPricingPort,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    const orderId = new UniqueId(command.orderId);
    const existingPayment = await this.paymentRepository.findByOrderId(orderId);

    if (existingPayment?.isSucceeded()) {
      throw new ApplicationException(
        `Order with Id ${command.orderId} has already been paid`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const pricing = await this.orderPricing.getOrderPricing(command.orderId);

    if (!pricing) {
      throw new ApplicationException(
        `Order with id ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const payment = this.eventPublisher.mergeObjectContext(
      existingPayment ?? Payment.initiate(orderId.getValue(), pricing.total),
    );

    const { url } = await this.paymentGateway.createCheckoutSession(
      pricing.lines,
      { orderId: command.orderId, paymentId: payment.id.getValue() },
      { successUrl: command.successUrl, cancelUrl: command.cancelUrl },
    );

    payment.startCheckout();

    await this.paymentRepository.save(payment);

    payment.commit();

    return { paymentId: payment.id.getValue(), checkoutUrl: url };
  }
}
