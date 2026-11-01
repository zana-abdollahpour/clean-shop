import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/customer/customer.module';
import { EventHandlers } from 'src/order/application/event-handlers';
import { CUSTOMER } from 'src/order/application/ports/customer.port';

import { ORDER_REPOSITORY } from 'src/order/application/ports/order-repository.port';
import { PRODUCT } from 'src/order/application/ports/product.port';
import { QueryHandlers } from 'src/order/application/queries/handlers';
import { OrderCommandHandlers } from 'src/order/application/use-cases';
import { CustomerAdapter } from 'src/order/infrastructure/adapters/customer.adapter';
import { DrizzleOrderRepository } from 'src/order/infrastructure/adapters/drizzle-order.repository';
import { ProductAdapter } from 'src/order/infrastructure/adapters/product.adapter';
import { OrderController } from 'src/order/presentation/order.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [CustomerModule, ProductModule],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository },
    { provide: CUSTOMER, useClass: CustomerAdapter },
    { provide: PRODUCT, useClass: ProductAdapter },
    ...OrderCommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class OrderModule {}
