import { ConfirmOrderHandler } from 'src/order/application/use-cases/confirm-order/confirm-order.handler';
import { DeliverOrderCommandHandler } from 'src/order/application/use-cases/deliver-order/deliver-order.handler';
import { PlaceOrderHandler } from 'src/order/application/use-cases/place-order/place-order.handler';
import { ShipOrderCommandHandler } from 'src/order/application/use-cases/ship-order/ship-order.handler';

export const OrderCommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  ShipOrderCommandHandler,
  DeliverOrderCommandHandler,
];
