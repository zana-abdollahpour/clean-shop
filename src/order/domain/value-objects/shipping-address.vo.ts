import { DomainException } from 'src/shared/domain/exception/domain.exception';

interface ShippingAddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class ShippingAddress {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  private constructor(props: ShippingAddressProps) {
    this._street = props.street;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._country = props.country;
  }

  static create(props: ShippingAddressProps): ShippingAddress {
    if (!props.street || !props.street.trim().length) {
      throw new DomainException('Shipping address street is required');
    }

    if (!props.city || !props.city.trim().length) {
      throw new DomainException('Shipping address city is required');
    }

    if (!props.state || !props.state.trim().length) {
      throw new DomainException('Shipping address state is required');
    }

    if (!props.zipCode || !props.zipCode.trim().length) {
      throw new DomainException('Shipping address zipCode is required');
    }

    if (!props.country || props.country.trim().length !== 2) {
      throw new DomainException(
        'Shipping address country must be a valid 2-letter ISO code',
      );
    }

    return new ShippingAddress({
      street: props.street.trim(),
      city: props.city.trim(),
      state: props.state.trim(),
      zipCode: props.zipCode.trim(),
      country: props.country.trim(),
    });
  }

  getStreet(): string {
    return this._street;
  }

  getCity(): string {
    return this._city;
  }

  getState(): string {
    return this._state;
  }

  getZipCode(): string {
    return this._zipCode;
  }

  getCountry(): string {
    return this._country;
  }

  equals(other: ShippingAddress): boolean {
    return Object.keys(other).every((prop) => this[prop] === other[prop]);
  }
}
