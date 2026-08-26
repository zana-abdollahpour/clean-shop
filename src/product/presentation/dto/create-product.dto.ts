import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

import { SKU_PATTERN } from 'src/product/domain/value-objects/sku.vo';

export class CreateProductDto {
  @IsString()
  @Length(2, 255)
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  @Length(3, 50)
  @Matches(SKU_PATTERN, {
    message: 'Sku must contain only alphabetic characters and dashes',
  })
  sku!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @Length(3, 3)
  @IsOptional()
  currency?: string = 'USD';

  @IsNumber()
  @Min(0)
  stock!: number;
}
