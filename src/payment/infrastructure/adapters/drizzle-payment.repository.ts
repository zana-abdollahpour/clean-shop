import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { Payment } from 'src/payment/domain/entities/payment.entity';
import { PaymentRepositoryPort } from 'src/payment/application/ports/payment.repository.port';
import {
  DRIZZLE,
  DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';
import { payments } from 'src/shared/infrastructure/database/postgres/schema/payments.schema';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { PaymentStatus } from 'src/payment/domain/value-objects/payment-status.vo';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private static toPersistence(payment: Payment): typeof payments.$inferSelect {
    return {
      id: payment.id.getValue(),
      orderId: payment.orderId,
      amount: payment.amount.toCents(),
      currency: payment.amount.getCurrency(),
      status: payment.status.getValue(),
      gatewayTransactionId: payment.gatewayTransactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private static toDomain(row: typeof payments.$inferSelect): Payment {
    return Payment.reconstitute({
      id: new PaymentId(row.id),
      orderId: row.orderId,
      amount: Money.create(row.amount / 100, row.currency),
      status: PaymentStatus.fromString(row.status),
      gatewayTransactionId: row.gatewayTransactionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async save(payment: Payment): Promise<void> {
    const row = DrizzlePaymentRepository.toPersistence(payment);
    await this.db
      .insert(payments)
      .values(row)
      .onConflictDoUpdate({
        target: payments.id,
        set: {
          gatewayTransactionId: row.gatewayTransactionId,
          status: row.status,
          amount: row.amount,
          currency: row.currency,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findByOrderId(orderId: OrderId): Promise<Payment | null> {
    const rows = await this.db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId.getValue()));

    if (!rows[0]) {
      return null;
    }

    return DrizzlePaymentRepository.toDomain(rows[0]);
  }
}
