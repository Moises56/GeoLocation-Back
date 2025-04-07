import { IsOptional, IsString } from 'class-validator';

export class FilterLocationsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  destinoAsignado?: string;
}
