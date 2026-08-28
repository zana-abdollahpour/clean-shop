import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { Product } from 'src/product/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

import { GetProductQuery } from './get-product.query';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productsRepository.findById(
      new ProductId(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return product;
  }
}
