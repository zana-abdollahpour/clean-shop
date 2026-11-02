export class OrderCanceledEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
  ) {}
}
