import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from 'src/order/application/use-cases/place-order/place-order.command';

import { PlaceOrderDto } from 'src/order/presentation/dtos/place-order.dto';

@Controller()
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async place(@Body() dto: PlaceOrderDto): Promise<void> {
    await this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(
        dto.customerId,
        dto.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          currency: item.currency ?? 'USD',
          quantity: item.quantity,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingState,
        dto.shippingZipCode,
        dto.shippingCountry,
      ),
    );
  }
}
