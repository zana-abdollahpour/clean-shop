import { Injectable } from '@nestjs/common';

import { CustomerRepositoryPort } from 'src/customer/application/ports/customer-repository.port';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {
  save(customer: Customer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: CustomerId): Promise<Customer | null> {
    throw new Error('Method not implemented.');
  }

  findByEmail(id: CustomerId): Promise<Customer | null> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Customer[]> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: CustomerId): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
