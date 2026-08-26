import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PRODUCT_REPOSITORY } from 'src/product/application/ports/product.repository.port';
import { DrizzleProductRepository } from 'src/product/infrastructure/adapters/drizzle-product.repository';
import { commandHandlers } from 'src/product/application';

import { ProductsController } from './presentation/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...commandHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
