import { Inject } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import {
  ProductFilters,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';

import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { Sku } from 'src/product/domain/value-objects/sku.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { MONGO_DB } from 'src/shared/infrastructure/database/mongodb/mongo.provider';

interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  sku: string;
  priceAmount: number;
  priceCurrency: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  private static toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomain(doc: ProductDocument): Product {
    return Product.reconstitute({
      id: new ProductId(doc._id),
      name: doc.name,
      description: doc.description,
      sku: Sku.create(doc.sku),
      stock: doc.stock,
      price: Money.create(doc.priceAmount / 100, doc.priceCurrency),
      isActive: doc.isActive,
      lowStockThreshold: doc.lowStockThreshold,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  save(product: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: ProductId): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  findBySku(sku: Sku): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  findByName(name: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  findAll(filters: ProductFilters): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: ProductId): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
