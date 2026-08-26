import { randomUUID } from 'node:crypto';

export class UniqueId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  getValue() {
    return this.value;
  }

  equals(other: UniqueId): boolean {
    return this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
