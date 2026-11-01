import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';

import { OrderPlacedEvent } from 'src/order/domain/events/order-placed.event';

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedEventHandler implements IEventHandler<OrderPlacedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderPlacedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order confirmation',
      message: `Your Clean Shop order ${event.orderId} has been confirmed. Thank you for your purchase!`,
    });
  }
}
