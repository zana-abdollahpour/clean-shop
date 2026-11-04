import { Inject, Injectable } from '@nestjs/common';

import { OrderRepositoryPort } from 'src/order/application/ports/order-repository.port';
import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';

import {
  OrderPricing,
  OrderPricingPort,
  PricingLine,
} from 'src/payment/application/ports/order-pricing.port';

@Injectable()
export class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject() private readonly orderRepository: OrderRepositoryPort,
  ) {}

  private toPricingItem(item: OrderItem): PricingLine {
    return {
      name: item.productName,
      quantity: item.quantity,
      unitAmount: item.getEffectiveUnitPrice(),
    };
  }

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    const order = await this.orderRepository.findById(new OrderId(orderId));

    if (!order) {
      return null;
    }

    return {
      total: order.getTotal(),
      lines: order.items.map((orderItem) => this.toPricingItem(orderItem)),
    };
  }
}
