import { Module } from '@nestjs/common';

import { CustomerCommandHandlers } from 'src/customer/application/use-cases';
import { CustomerController } from 'src/customer/presentation/customer.controller';

import { CUSTOMER_REPOSITORY } from 'src/customer/application/ports/customer-repository.port';
import { DrizzleCustomerRepository } from 'src/customer/infrastructure/adapters/drizzle-customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CustomerCommandHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
