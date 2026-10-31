import { Inject, Injectable } from '@nestjs/common';

import { CustomerPort } from 'src/order/application/ports/customer.port';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from 'src/customer/application/ports/customer-repository.port';

@Injectable()
export class CustomerAdapter implements CustomerPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async exists(customerId: string): Promise<boolean> {
    const foundCustomer = await this.customerRepository.findById(
      new CustomerId(customerId),
    );
    return !!foundCustomer;
  }
}
