import { DomainException } from 'src/shared/domain/exception/domain.exception';

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const trimmedNormalized = value.trim().toLowerCase();

    if (!trimmedNormalized) {
      throw new DomainException(`Email cannot be empty`);
    }

    if (!EMAIL_PATTERN.test(trimmedNormalized)) {
      throw new DomainException(`Invalid email format: ${trimmedNormalized}`);
    }

    return new Email(trimmedNormalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
