import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';
import { GetOrderQuery } from 'src/order/application/queries/get-order.query';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const order = await this.orderRepository.findById(
      new OrderId(query.orderId),
    );

    if (!order) {
      throw new ApplicationException(
        `Order with id ${query.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return order;
  }
}
