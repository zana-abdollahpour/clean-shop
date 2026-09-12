import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';

import { CustomerRegisteredEvent } from 'src/customer/domain/events/customer-registered.event';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredEventHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome',
      message: `Welcome to Clean Shop, ${event.firstName}! Your account has been created successfully!`,
    });
  }
}
