import { AggregateRoot } from 'src/shared/domain/aggregate-root';
import { PaymentStatus } from 'src/payment/domain/value-objects/payment-status.vo';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { DomainException } from 'src/shared/domain/exception/domain.exception';
import { PaymentCompletedEvent } from 'src/payment/domain/events/payment-completed.event';

export interface PaymentProps {
  id: PaymentId;
  orderId: string;
  amount: Money;
  status: PaymentStatus;
  gatewayTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _id: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _status: PaymentStatus;
  private _gatewayTransactionId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PaymentProps) {
    super();

    this._id = props.id;
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._status = props.status;
    this._gatewayTransactionId = props.gatewayTransactionId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static initiate(orderId: string, amount: Money): Payment {
    if (amount.getAmount() <= 0) {
      throw new DomainException('Payment amount must be greater than 0');
    }

    const now = new Date();
    return new Payment({
      id: new PaymentId(),
      orderId,
      amount,
      status: PaymentStatus.pending(),
      gatewayTransactionId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  startCheckout() {
    if (this.isSucceeded()) {
      throw new DomainException(
        `Cannot start checkout for a payment in ${this._status.getValue()} status`,
      );
    }

    this._status = PaymentStatus.processing();
    this._updatedAt = new Date();
  }

  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  isSucceeded(): boolean {
    return this._status.isSucceeded();
  }

  complete(gatewayTransactionId: string) {
    this._gatewayTransactionId = gatewayTransactionId;
    this._status = this._status.transitionToSucceeded();
    this._updatedAt = new Date();

    this.apply(
      new PaymentCompletedEvent(
        this._id.getValue(),
        this._orderId,
        this._gatewayTransactionId,
      ),
    );
  }

  get id() {
    return this._id;
  }

  get orderId() {
    return this._orderId;
  }

  get amount() {
    return this._amount;
  }

  get status() {
    return this._status;
  }

  get gatewayTransactionId() {
    return this._gatewayTransactionId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
