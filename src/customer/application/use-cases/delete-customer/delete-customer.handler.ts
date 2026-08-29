import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { DeleteCustomerCommand } from './delete-customer.command';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from 'src/customer/application/ports/customer-repository.port';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

export class DeleteCustomerHandler implements ICommandHandler<
  DeleteCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<any> {
    const customerId = new CustomerId(command.customerId);

    const existingCustomer = await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.customerRepository.deleteById(customerId);
  }
}
