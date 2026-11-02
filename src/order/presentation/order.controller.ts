import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetOrderQuery } from 'src/order/application/queries/get-order.query';
import { ListOrdersQuery } from 'src/order/application/queries/list-orders.query';
import { cancelOrderCommand } from 'src/order/application/use-cases/cancel-order/cancel-order.handler';
import { ConfirmOrderCommand } from 'src/order/application/use-cases/confirm-order/confirm-order.command';
import { DeliverOrderCommand } from 'src/order/application/use-cases/deliver-order/deliver-order.command';
import { PlaceOrderCommand } from 'src/order/application/use-cases/place-order/place-order.command';
import { ShipOrderCommand } from 'src/order/application/use-cases/ship-order/ship-order.command';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderResponseDto } from 'src/order/presentation/dtos/order-response.dto';

import { PlaceOrderDto } from 'src/order/presentation/dtos/place-order.dto';
import { ShipOrderDto } from 'src/order/presentation/dtos/ship-order.dto';

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
          discount: item.discount,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingState,
        dto.shippingZipCode,
        dto.shippingCountry,
      ),
    );
  }

  @Get()
  async findAll(
    @Query('customerId') customerId: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.queryBus.execute<ListOrdersQuery, Order[]>(
      new ListOrdersQuery(customerId),
    );

    return orders.map((order) => OrderResponseDto.fromDomain(order));
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.queryBus.execute<GetOrderQuery, Order>(
      new GetOrderQuery(id),
    );

    return OrderResponseDto.fromDomain(order);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<ConfirmOrderCommand>(
      new ConfirmOrderCommand(id),
    );
  }

  @Patch(':id/ship')
  async ship(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ShipOrderDto,
  ): Promise<void> {
    await this.commandBus.execute<ShipOrderCommand, void>(
      new ShipOrderCommand(id, dto.trackingNumber),
    );
  }

  @Patch(':id/deliver')
  async deliver(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<DeliverOrderCommand, void>(
      new DeliverOrderCommand(id),
    );
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('reason') reason: string,
  ): Promise<void> {
    await this.commandBus.execute<cancelOrderCommand, void>(
      new cancelOrderCommand(id, reason),
    );
  }
}
