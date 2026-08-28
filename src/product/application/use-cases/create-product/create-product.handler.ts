import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateProductCommand } from 'src/product/application/use-cases/create-product/create-product.command';
import { PRODUCT_REPOSITORY } from 'src/product/application/ports/product.repository.port';
import type { ProductRepository } from 'src/product/application/ports/product.repository.port';

import { Product } from 'src/product/domain/entities/product.entity';
import { Sku } from 'src/product/domain/value-objects/sku.vo';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const { name, description, sku, price, currency, stock } = command;

    const existingBySku = await this.productRepository.findBySku(
      Sku.create(sku),
    );

    if (existingBySku) {
      throw new ApplicationException(
        `Product with SKU ${sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingByName = await this.productRepository.findByName(name);

    if (existingByName) {
      throw new ApplicationException(
        `Product with name ${sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

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
