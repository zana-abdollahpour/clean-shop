import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';

export const PRODUCT_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<void>;

  findById(id: CustomerId): Promise<Customer | null>;

  findByEmail(id: CustomerId): Promise<Customer | null>;

  findAll(): Promise<Customer[]>;

  deleteById(id: CustomerId): Promise<void>;
}
