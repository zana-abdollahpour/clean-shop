import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';
import { ListOrdersQuery } from 'src/order/application/queries/list-orders.query';
import { Order } from 'src/order/domain/entities/order.entity';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<
  ListOrdersQuery,
  Order[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  execute(query: ListOrdersQuery): Promise<Order[]> {
    if (query.customerId) {
      return this.orderRepository.findByCustomerId(query.customerId);
    }
    return this.orderRepository.findAll();
  }
}
