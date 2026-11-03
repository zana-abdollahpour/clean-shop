import { DomainException } from 'src/shared/domain/exception/domain.exception';

export enum PaymentStatusValue {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
}

export class PaymentStatus {
  private readonly value: PaymentStatusValue;

  private constructor(value: PaymentStatusValue) {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Pending);
  }

  static processing(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Processing);
  }

  static succeeded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Succeeded);
  }

  static fromString(value: string): PaymentStatus {
    const isValidStatus = Object.values(PaymentStatusValue).find(
      (status: string) => status === value,
    );

    if (!isValidStatus) {
      throw new DomainException(`Invalid payment status: ${value}`);
    }

    return new PaymentStatus(value as PaymentStatusValue);
  }

  getValue() {
    return this.value;
  }
}
