import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { Email } from 'src/customer/domain/value-objects/email.vo';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<void>;

  findById(id: CustomerId): Promise<Customer | null>;

  findByEmail(email: Email): Promise<Customer | null>;

  findAll(): Promise<Customer[]>;

  deleteById(id: CustomerId): Promise<void>;
}
