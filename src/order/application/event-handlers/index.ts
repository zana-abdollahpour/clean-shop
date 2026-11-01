import { OrderConfirmedEventHandler } from 'src/order/application/event-handlers/order-confirmed.event-handler';
import { OrderPlacedEventHandler } from 'src/order/application/event-handlers/order-placed.event-handler';

export const EventHandlers = [
  OrderPlacedEventHandler,
  OrderConfirmedEventHandler,
];
