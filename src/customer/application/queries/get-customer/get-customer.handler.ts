import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Customer } from 'src/customer/domain/entities/customer.entity';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from 'src/customer/application/ports/customer-repository.port';

import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

import { GetCustomerQuery } from './get-customer.query';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.customerId),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${query.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
