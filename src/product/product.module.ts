import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { commandHandlers } from 'src/product/application/use-cases';
import { queryHandlers } from 'src/product/application/queries';

import { PRODUCT_REPOSITORY } from 'src/product/application/ports/product.repository.port';
import { DrizzleProductRepository } from 'src/product/infrastructure/adapters/drizzle-product.repository';
import { MongoProductRepository } from 'src/product/infrastructure/adapters/mongo-product.repository';

import { ProductsController } from './presentation/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    MongoProductRepository,
    DrizzleProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
      useFactory: (
        configService: ConfigService,
        mongoProductRepository: MongoProductRepository,
        drizzleProductRepository: DrizzleProductRepository,
      ) => {
        const selectedDb = configService.get<string>('DATABASE');

        if (selectedDb === 'mongodb') {
          return mongoProductRepository;
        }

        if (selectedDb === 'postgres') {
          return drizzleProductRepository;
        }

        return drizzleProductRepository;
      },
    },
  ],
})
export class ProductModule {}
