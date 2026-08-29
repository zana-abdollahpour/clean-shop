import { AggregateRoot } from 'src/shared/domain/aggregate-root';

import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { Email } from 'src/customer/domain/value-objects/email.vo';

interface CustomerProps {
  id: CustomerId;
  email: Email;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private readonly _id: CustomerId;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _isActive: boolean;
  private _phone: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();

    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._isActive = props.isActive;
    this._phone = props.phone;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static register(
    email: Email,
    firstName: string,
    lastName: string,
    phone: string,
  ): Customer {
    const id = new CustomerId();
    const now = new Date();

    return new Customer({
      id,
      email,
      firstName,
      lastName,
      phone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  getId() {
    return this._id;
  }

  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  getEmail() {
    return this._email;
  }

  getFirstName() {
    return this._firstName;
  }

  getLastName() {
    return this._lastName;
  }

  getIsActive() {
    return this._isActive;
  }

  getPhone() {
    return this._phone;
  }

  getCreatedAt() {
    return this._createdAt;
  }

  getUpdatedAt() {
    return this._updatedAt;
  }
}
