import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Product } from 'src/product/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';

import { ListProductsQuery } from './list-products.query';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<
  ListProductsQuery,
  Product[]
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: ProductRepository,
  ) {}

  execute(query: ListProductsQuery): Promise<Product[]> {
    const { isActive, minPrice, maxPrice } = query;
    return this.productsRepository.findAll({ isActive, minPrice, maxPrice });
  }
}
