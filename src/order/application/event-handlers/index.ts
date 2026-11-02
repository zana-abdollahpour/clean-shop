import { OrderConfirmedEventHandler } from 'src/order/application/event-handlers/order-confirmed.event-handler';
import { OrderPlacedEventHandler } from 'src/order/application/event-handlers/order-placed.event-handler';
import { OrderShippedEventHandler } from 'src/order/application/event-handlers/order-shipped.event-handler';

export const EventHandlers = [
  OrderPlacedEventHandler,
  OrderConfirmedEventHandler,
  OrderShippedEventHandler,
];
