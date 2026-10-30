import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findCustomerById(customerId: string): Promise<Order[] | null>;
  findAll(id: OrderId): Promise<void>;
  delete(id: OrderId): Promise<void>;
}
