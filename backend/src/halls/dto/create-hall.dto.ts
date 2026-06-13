import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateHallDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsInt()
  @IsOptional()
  boothCount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
