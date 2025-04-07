import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  @IsString()
  @IsOptional()
  direccionAsignada?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @IsOptional()
  tiempoEnDestino?: number;

  @IsString()
  @IsOptional()
  destinoAsignado?: string;
}
