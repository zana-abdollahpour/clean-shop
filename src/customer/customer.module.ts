import { Module } from '@nestjs/common';

import { CUSTOMER_REPOSITORY } from 'src/customer/application/ports/customer-repository.port';
import { DrizzleCustomerRepository } from 'src/customer/infrastructure/adapters/drizzle-customer.repository';

@Module({
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
