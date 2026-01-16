import {
  IsArray,
  IsInt,
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
  @IsOptional()
  slug?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsString()
  gender: string;
}
