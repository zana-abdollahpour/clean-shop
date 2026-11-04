import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ConfirmPaymentCommand } from 'src/payment/application/use-cases/confirm-payment/confirm-payment.command';
import {
  PAYMENT_REPOSITORY,
  PaymentRepositoryPort,
} from 'src/payment/application/ports/payment.repository.port';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentHandler implements ICommandHandler<
  ConfirmPaymentCommand,
  void
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ConfirmPaymentCommand): Promise<void> {
    const payment = await this.paymentRepository.findById(
      new PaymentId(command.paymentId),
    );

    if (!payment) {
      throw new ApplicationException(
        `Payment with id ${command.paymentId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    if (payment.isSucceeded()) {
      return;
    }

    const tracked = this.eventPublisher.mergeObjectContext(payment);

    tracked.complete(command.gatewayTransactionId);

    await this.paymentRepository.save(tracked);

    tracked.commit();
  }
}
