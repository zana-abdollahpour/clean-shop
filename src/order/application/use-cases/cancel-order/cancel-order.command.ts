import { Inject } from '@nestjs/common';
import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';
import { cancelOrderCommand } from 'src/order/application/use-cases/cancel-order/cancel-order.handler';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

export class CancelOrderCommandHandler implements ICommandHandler<
  cancelOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: cancelOrderCommand): Promise<void> {
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

    trackedOrder.cancel(command.reason);

    await this.orderRepository.save(trackedOrder);

    trackedOrder.commit();
  }
}
