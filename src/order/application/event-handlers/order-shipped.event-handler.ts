import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';
import { OrderShippedEvent } from 'src/order/domain/events/order-shipped.event';

@EventsHandler(OrderShippedEvent)
export class OrderShippedEventHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order shipped',
      message: `Your Clean Shop order ${event.orderId} has been shipped.\n Your tracking number is ${event.trackingNumber}`,
    });
  }
}
