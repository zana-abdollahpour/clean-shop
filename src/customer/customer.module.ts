import { Module } from '@nestjs/common';

import { CustomerController } from 'src/customer/presentation/customer.controller';
import { CustomerCommandHandlers } from 'src/customer/application/use-cases';
import { customerQueryHandlers } from 'src/customer/application/queries';
import { EventHandlers } from 'src/customer/application/event-handlers';

import { CUSTOMER_REPOSITORY } from 'src/customer/application/ports/customer-repository.port';
import { DrizzleCustomerRepository } from 'src/customer/infrastructure/adapters/drizzle-customer.repository';

import { NOTIFICATION_SERVICE } from 'src/customer/application/ports/notification.port';
import { ConsoleNotificationAdapter } from 'src/customer/infrastructure/adapters/console-notification.adapter';
import { NodeMailerEmailAdapter } from 'src/customer/infrastructure/adapters/nodemailer-notification.adapter';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CustomerCommandHandlers,
    ...customerQueryHandlers,
    ...EventHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass:
        process.env.NODE_ENV === 'production'
          ? NodeMailerEmailAdapter
          : ConsoleNotificationAdapter,
    },
  ],
})
export class CustomerModule {}
