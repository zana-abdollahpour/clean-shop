import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Customer } from 'src/customer/domain/entities/customer.entity';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from 'src/customer/application/ports/customer-repository.port';

import { listCustomersQuery } from './list-customers.query';

@QueryHandler(listCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  listCustomersQuery,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customersRepository: CustomerRepositoryPort,
  ) {}

  async execute(_query: listCustomersQuery): Promise<Customer[]> {
    return this.customersRepository.findAll();
  }
}
