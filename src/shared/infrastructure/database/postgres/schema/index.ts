import { customers } from './customer.schema';
import { products } from './products.schema';
import { payments, paymentStatusEnum } from './payments.schema';
import { orders, orderItems, orderStatusEnum } from './orders.schema';
import {
  ordersRelations,
  orderItemRelations,
  paymentsRelations,
} from './relations.schema';

export const schema = {
  customers,
  products,
  orders,
  orderItems,
  payments,
  orderStatusEnum,
  paymentStatusEnum,
  ordersRelations,
  orderItemRelations,
  paymentsRelations,
};
