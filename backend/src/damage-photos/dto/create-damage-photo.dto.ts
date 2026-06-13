import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateDamagePhotoDto {
  @IsInt()
  dismantleId: number;

  @IsString()
  photoUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;
}
