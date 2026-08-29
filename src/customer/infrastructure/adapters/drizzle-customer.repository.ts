import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CustomerRepositoryPort } from 'src/customer/application/ports/customer-repository.port';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { Email } from 'src/customer/domain/value-objects/email.vo';

import { customers } from 'src/shared/infrastructure/database/postgres/schema/customer.schema';
import {
  DRIZZLE,
  DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  private static toPersistence(
    customer: Customer,
  ): typeof customers.$inferSelect {
    return {
      id: customer.getId().getValue(),
      email: customer.getEmail().getValue(),
      phone: customer.getPhone(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      isActive: customer.getIsActive(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }

  private static toDomain(row: typeof customers.$inferSelect): Customer {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      email: Email.create(row.email),
      isActive: row.isActive,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async save(customer: Customer): Promise<void> {
    const data = DrizzleCustomerRepository.toPersistence(customer);
    await this.db
      .insert(customers)
      .values(data)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.isActive,
          phone: data.phone,
          updatedAt: data.updatedAt,
        },
      });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id.getValue()));

    if (!rows.length) {
      return null;
    }

    return DrizzleCustomerRepository.toDomain(rows[0]);
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (!rows.length) {
      return null;
    }

    return DrizzleCustomerRepository.toDomain(rows[0]);
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);
    return rows.map((row) => DrizzleCustomerRepository.toDomain(row));
  }

  async deleteById(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }
}
