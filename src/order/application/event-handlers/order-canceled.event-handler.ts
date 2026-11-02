import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';

import { OrderCanceledEvent } from 'src/order/domain/events/order-canceled.event';

@EventsHandler(OrderCanceledEvent)
export class OrderCanceledEventHandler implements IEventHandler<OrderCanceledEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderCanceledEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Canceled',
      message: `Order with id ${event.orderId} has been canceled`,
    });
  }
}
