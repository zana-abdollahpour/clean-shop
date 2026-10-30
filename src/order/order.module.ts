import { Module } from '@nestjs/common';

import { ORDER_REPOSITORY } from 'src/order/application/ports/order-repository.port';
import { DrizzleOrderRepository } from 'src/order/infrastructure/adapters/drizzle-order.repository';

@Module({
  providers: [{ provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository }],
})
export class OrderModule {}
