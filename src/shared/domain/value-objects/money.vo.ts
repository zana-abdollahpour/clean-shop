import { DomainException } from 'src/shared/domain/exception/domain.exception';

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency = 'USD'): Money {
    if (amount < 0) {
      throw new DomainException('Money amount cannot be negative');
    }

    const normalizedAmount = Math.round(amount * 100) / 100;

    return new Money(normalizedAmount, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  toCents() {
    return Math.round(this.amount * 100);
  }
}
