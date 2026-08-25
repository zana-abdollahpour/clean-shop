import { UniqueId } from './value-objects/unique-id.vo';

export abstract class Entity<TId extends UniqueId = UniqueId> {
  constructor(protected readonly id: TId) {}

  getId(): TId {
    return this.id;
  }

  equals(other: Entity<TId>): boolean {
    if (this === other) {
      return true;
    }

    if (other === null || other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
