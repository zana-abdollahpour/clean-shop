import { Inject, Injectable } from '@nestjs/common';

import { products } from 'src/shared/infrastructure/database/postgres/schema/products.schema';
import { DRIZZLE } from 'src/shared/infrastructure/database/postgres/drizzle.provider';
import type { DrizzleDB } from 'src/shared/infrastructure/database/postgres/drizzle.provider';

import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import {
  ProductFilters,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private static toPersistence(product: Product): typeof products.$inferSelect {
    return {
      id: product.id.getValue(),
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

  async save(product: Product): Promise<void> {
    const row = DrizzleProductRepository.toPersistence(product);

    await this.db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name,
          description: row.description,
          sku: row.sku,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          stock: row.stock,
          isActive: row.isActive,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  findById(id: ProductId): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  findAll(filters: ProductFilters): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}
