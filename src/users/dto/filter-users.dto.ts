import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  rol?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  estado?: boolean;
} 