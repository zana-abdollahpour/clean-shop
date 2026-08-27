import { DomainException } from 'src/shared/domain/exception/domain.exception';

export const SKU_PATTERN = /^[A-Za-z0-9-]+$/;

export class Sku {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Sku {
    const trimmed = value.trim();

    if (trimmed.length < Sku.MIN_LENGTH || trimmed.length > Sku.MAX_LENGTH) {
      throw new DomainException(
        `Sku must be between ${Sku.MIN_LENGTH} and ${Sku.MAX_LENGTH} characters`,
      );
    }

    if (!SKU_PATTERN.test(trimmed)) {
      throw new DomainException(
        'Sku must contain only alphabetic characters and dashes',
      );
    }

    return new Sku(trimmed.toUpperCase());
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
