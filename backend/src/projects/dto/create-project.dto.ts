import { IsString, IsInt, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  boothNumber: string;

  @IsInt()
  @IsOptional()
  boothArea?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  hallId: number;

  @IsDateString()
  entryTime: string;

  @IsDateString()
  buildDeadline: string;

  @IsDateString()
  @IsOptional()
  dismantleStartTime?: string;

  @IsInt()
  @IsOptional()
  carpenterNeeded?: number;

  @IsInt()
  @IsOptional()
  electricianNeeded?: number;

  @IsInt()
  @IsOptional()
  decoratorNeeded?: number;

  @IsInt()
  @IsOptional()
  forkliftNeeded?: number;

  @IsBoolean()
  @IsOptional()
  nightWorkRequired?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  projectManager?: string;

  @IsString()
  @IsOptional()
  clientName?: string;
}
