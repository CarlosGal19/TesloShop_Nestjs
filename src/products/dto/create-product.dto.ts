import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(4)
  title: string;

  @IsNumber()
  @Min(0)
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  slug: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsArray()
  @IsOptional()
  sizes: string[];

  @IsString()
  gender: string;
}
