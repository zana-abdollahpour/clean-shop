import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from 'src/product/application/use-cases/create-product/create-product.command';

import { CreateProductDto } from 'src/product/presentation/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    const { name, description, sku, price, currency, stock } = createProductDto;

    await this.commandBus.execute(
      new CreateProductCommand(
        name,
        description,
        sku,
        price,
        currency || 'USD',
        stock,
      ),
    );
  }
}
