import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { Payment } from 'src/payment/domain/entities/payment.entity';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepositoryPort {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: OrderId): Promise<Payment | null>;
}
