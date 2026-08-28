import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ListProductsQuery } from 'src/product/application/queries/list-products/list-products.query';
import { CreateProductCommand } from 'src/product/application/use-cases/create-product/create-product.command';
import { Product } from 'src/product/domain/entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { GetProductQuery } from 'src/product/application/queries/get-product/get-product.query';
import { DeleteProductCommand } from 'src/product/application/use-cases/delete-product/delete-product.command';

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

  @Get('id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponseDto> {
    const product = await this.queryBus.execute<GetProductQuery, Product>(
      new GetProductQuery(id),
    );

    return ProductResponseDto.fromDomain(product);
  }

  @Delete('id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute<DeleteProductCommand, void>(
      new DeleteProductCommand(id),
    );
  }
}
