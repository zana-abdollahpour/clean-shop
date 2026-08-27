import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ListProductsQuery } from 'src/product/application/queries/list-products/list-products.query';
import { CreateProductCommand } from 'src/product/application/use-cases/create-product/create-product.command';
import { Product } from 'src/product/domain/entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product.response.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    const { name, description, sku, price, currency, stock } = createProductDto;

    await this.commandBus.execute<CreateProductCommand, void>(
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

  @Get()
  async findAll(
    @Query('isActive') isActive?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.queryBus.execute<ListProductsQuery, Product[]>(
      new ListProductsQuery(
        isActive !== undefined ? isActive === 'true' : undefined,
        minPrice !== undefined ? parseFloat(minPrice) : undefined,
        maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
      ),
    );

    return products.map(ProductResponseDto.fromDomain);
  }
}
