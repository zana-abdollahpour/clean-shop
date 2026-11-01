import { Inject } from '@nestjs/common';
import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';

import { ConfirmOrderCommand } from 'src/order/application/use-cases/confirm-order/confirm-order.command';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

export class ConfirmOrderHandler implements ICommandHandler<
  ConfirmOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    const foundOrder = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!foundOrder) {
      throw new ApplicationException(
        `Order with id ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const trackedOrder = this.eventPublisher.mergeObjectContext(foundOrder);

    trackedOrder.confirm();
    await this.orderRepository.save(trackedOrder);
    trackedOrder.commit();
  }
}
