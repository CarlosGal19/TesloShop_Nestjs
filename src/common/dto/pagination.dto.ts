import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsOptional()
  offset?: number;
}
