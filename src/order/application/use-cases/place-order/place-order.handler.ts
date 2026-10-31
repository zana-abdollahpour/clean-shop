import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import { Order } from 'src/order/domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from 'src/order/application/ports/order-repository.port';

import { PlaceOrderCommand } from './place-order.command';
import { PRODUCT, ProductPort } from 'src/order/application/ports/product.port';
import {
  CUSTOMER,
  CustomerPort,
} from 'src/order/application/ports/customer.port';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(CUSTOMER) private readonly customer: CustomerPort,
    @Inject(PRODUCT) private readonly product: ProductPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<any> {
    const customerExists = await this.customer.exists(command.customerId);
    if (!customerExists) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    for (const item of command.items) {
      const productExists = await this.product.exists(item.productId);
      if (!productExists) {
        throw new ApplicationException(
          `Product with id ${item.productId} not found`,
          ApplicationExceptionCode.NOT_FOUND,
        );
      }
    }

    const items = command.items.map((item) =>
      OrderItem.create(
        item.productId,
        item.productName,
        Money.create(item.unitPrice, item.currency),
        item.quantity,
      ),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCountry,
    });

    const order = Order.place(command.customerId, items, shippingAddress);
    await this.orderRepository.save(order);
  }
}
