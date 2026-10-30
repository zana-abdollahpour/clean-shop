import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { MongoModule } from 'src/shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from 'src/shared/infrastructure/database/postgres/drizzle.module';

import { ProductModule } from 'src/product/product.module';
import { CustomerModule } from 'src/customer/customer.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule.forRoot(),
    MongoModule,
    DrizzleModule,
    ProductModule,
    CustomerModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
