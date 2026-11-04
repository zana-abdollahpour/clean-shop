import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { Payment } from 'src/payment/domain/entities/payment.entity';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepositoryPort {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
  findByOrderId(orderId: OrderId): Promise<Payment | null>;
}
