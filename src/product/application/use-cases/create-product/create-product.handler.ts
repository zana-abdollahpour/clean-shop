import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PRODUCT_REPOSITORY } from 'src/product/application/ports/product.repository.port';
import type { ProductRepository } from 'src/product/application/ports/product.repository.port';

import { CreateProductCommand } from './create-product.command';
import { Product } from 'src/product/domain/entities/product.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const { name, description, sku, price, currency, stock } = command;
    const product = Product.create(
      name,
      description,
      sku,
      price,
      currency,
      stock,
    );

    await this.productRepository.save(product);
  }
}
