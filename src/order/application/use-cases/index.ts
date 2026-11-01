import { ConfirmOrderHandler } from 'src/order/application/use-cases/confirm-order/confirm-order.handler';
import { PlaceOrderHandler } from 'src/order/application/use-cases/place-order/place-order.handler';

export const OrderCommandHandlers = [PlaceOrderHandler, ConfirmOrderHandler];
