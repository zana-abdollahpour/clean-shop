import { Injectable, Logger } from '@nestjs/common';

import {
  Notification,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendNotification(notification: Notification) {
    this.logger.log(
      `[${notification.subject}] To: ${notification.recipient} | ${notification.message}`,
    );
  }
}
