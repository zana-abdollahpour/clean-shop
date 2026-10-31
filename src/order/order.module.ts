import { Module } from '@nestjs/common';

import { ORDER_REPOSITORY } from 'src/order/application/ports/order-repository.port';
import { OrderCommandHandlers } from 'src/order/application/use-cases';
import { DrizzleOrderRepository } from 'src/order/infrastructure/adapters/drizzle-order.repository';
import { OrderController } from 'src/order/presentation/order.controller';

@Module({
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository },
    ...OrderCommandHandlers,
  ],
})
export class OrderModule {}
