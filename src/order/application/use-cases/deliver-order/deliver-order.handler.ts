import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';
import { DeliverOrderCommand } from 'src/order/application/use-cases/deliver-order/deliver-order.command';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderCommandHandler implements ICommandHandler<DeliverOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<any> {
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

    trackedOrder.deliver();

    await this.orderRepository.save(trackedOrder);

    trackedOrder.commit();
  }
}
