import { OrderPlacedEvent } from 'src/order/domain/events/order-placed.event';
import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import { AggregateRoot } from 'src/shared/domain/aggregate-root';
import { DomainException } from 'src/shared/domain/exception/domain.exception';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { OrderConfirmedEvent } from 'src/order/domain/events/order-confirmed.event';
import { OrderShippedEvent } from 'src/order/domain/events/order-shipped.event';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private readonly _id: OrderId;
  private readonly _customerId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private readonly _shippingAddress: ShippingAddress;
  private _trackingNumber: string | null;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: OrderProps) {
    super();
    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this._shippingAddress = props.shippingAddress;
    this._trackingNumber = props.trackingNumber;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static reconstitute(props: OrderProps) {
    return new Order(props);
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (!items.length) {
      throw new DomainException('An order must contain at least one item');
    }

    const now = new Date();
    const id = new OrderId();

    const order = new Order({
      id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    });

    order.apply(new OrderPlacedEvent(id.getValue(), customerId));

    return order;
  }

  getSubtotal(): Money {
    if (!this._items.length) {
      return Money.zero();
    }

    return this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }

  getTotal(): Money {
    return this.getSubtotal();
  }

  getItemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get id(): OrderId {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get items(): Readonly<OrderItem[]> {
    return this._items;
  }

  get shippingAddress(): ShippingAddress {
    return this._shippingAddress;
  }

  get trackingNumber(): string | null {
    return this._trackingNumber;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  confirm(): void {
    this._status = this._status.confirm();
    this._updatedAt = new Date();

    this.apply(
      new OrderConfirmedEvent(this._id.getValue(), this._customerId, {
        street: this._shippingAddress.street,
        city: this._shippingAddress.city,
        country: this._shippingAddress.country,
        zipCode: this._shippingAddress.zipCode,
        state: this._shippingAddress.state,
      }),
    );
  }

  ship(trackingNumber: string): void {
    if (!trackingNumber || !trackingNumber.trim().length) {
      throw new DomainException('Tracking number is required for shipping');
    }

    this._status = this._status.ship();
    this._trackingNumber = trackingNumber.trim();
    this._updatedAt = new Date();

    this.apply(
      new OrderShippedEvent(
        this._id.getValue(),
        this._trackingNumber,
        this._customerId.toString(),
      ),
    );
  }
}
