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

  private assertSameCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new DomainException(
        `Currency mismatch: ${this.currency} vs ${other.currency}`,
      );
    }
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents / 100, currency.toUpperCase());
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new DomainException('Multiplication can not be negative');
    }

    return Money.create(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount >= other.amount;
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new DomainException('Result of subtraction can not be negative');
    }
    return Money.create(result, this.currency);
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
