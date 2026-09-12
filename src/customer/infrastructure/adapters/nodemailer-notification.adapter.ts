import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from 'src/customer/application/ports/customer-repository.port';

import {
  Notification,
  NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { ApplicationException } from 'src/shared/domain/exception/application.exception';

@Injectable()
export class NodeMailerEmailAdapter implements NotificationPort {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly logger = new Logger(NodeMailerEmailAdapter.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<string>('SMTP_PORT'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    this.from = this.configService.getOrThrow<string>('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    if (!customer) {
      throw new ApplicationException(
        `User not found by ${notification.recipientId}`,
      );
    }

    await this.transporter.sendMail({
      from: this.from,
      to: customer.getEmail().toString(),
      subject: notification.subject,
      html: notification.message,
    });

    this.logger.log(`Email sent to ${customer.getEmail().toString()}`);
  }
}
