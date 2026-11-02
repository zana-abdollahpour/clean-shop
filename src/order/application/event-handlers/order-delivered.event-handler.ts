import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { OrderDeliveredEvent } from 'src/order/domain/events/order-delivered.event';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredEventHandler implements IEventHandler<OrderDeliveredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderDeliveredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Delivered',
      message: 'Your Clean Shop order has been delivered successfully',
    });
  }
}
