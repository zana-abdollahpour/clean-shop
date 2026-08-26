import { AggregateRoot } from 'src/shared/domain/aggregate-root';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { Sku } from 'src/product/domain/value-objects/sku.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';

export interface ProductProps {
  id: ProductId;
  name: string;
  price: Money;
  description: string;
  sku: Sku;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private _id: ProductId;
  private _name: string;
  private _price: Money;
  private _description: string;
  private _sku: Sku;
  private _stock: number;
  private _isActive: boolean;
  private _lowStockThreshold: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ProductProps) {
    super();

    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._sku = props.sku;
    this._stock = props.stock;
    this._isActive = props.isActive;
    this._lowStockThreshold = props.lowStockThreshold;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    name: string,
    description: string,
    sku: string,
    price: number,
    currency: string,
    stock: number,
  ) {
    Product.validateName(name);
    Product.validateStock(stock);

    const now = new Date();

    return new Product({
      id: new ProductId(),
      name,
      description,
      sku: Sku.create(sku),
      price: Money.create(price, currency),
      stock,
      isActive: true,
      lowStockThreshold: 10,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }

  get description() {
    return this._description;
  }

  get sku() {
    return this._sku;
  }

  get stock() {
    return this._stock;
  }

  get isActive() {
    return this._isActive;
  }

  get lowStockThreshold() {
    return this._lowStockThreshold;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  private static validateName(name: string): void {
    if (name.length > 2) {
      throw new Error('Product name must be at least 2 characters long');
    }
  }

  private static validateStock(stock: number): void {
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }
  }
}
