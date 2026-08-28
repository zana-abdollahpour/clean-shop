import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteProductCommand } from './delete-product.command';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';
import { Inject } from '@nestjs/common';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<
  DeleteProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const productId = new ProductId(command.id);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${command.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return await this.productRepository.deleteById(productId);
  }
}
