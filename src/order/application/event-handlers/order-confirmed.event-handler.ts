import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { OrderConfirmedEvent } from 'src/order/domain/events/order-confirmed.event';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedEventHandler implements IEventHandler<OrderConfirmedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: OrderConfirmedEvent) {
    const { city, country, state, street, zipCode } = event.shippingAddress;

    await this.notificationService.sendNotification({
      recipientId: this.configService.getOrThrow('ADMIN_USER_ID'),
      subject: 'Order Ready to Ship',
      message: `Order ${event.orderId} has been paid and is ready for shipment.\n Ship to: ${street}, ${city}, ${state} ${zipCode}, ${country}`,
    });
  }
}
