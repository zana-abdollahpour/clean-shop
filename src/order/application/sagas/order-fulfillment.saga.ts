import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { ConfirmOrderCommand } from 'src/order/application/use-cases/confirm-order/confirm-order.command';
import { PaymentCompletedEvent } from 'src/payment/domain/events/payment-completed.event';

@Injectable()
export class OrderFulfillmentSage {
  @Saga()
  paymentCompleted(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(PaymentCompletedEvent),
      map((event) => new ConfirmOrderCommand(event.orderId)),
    );
  }
}
