import { IsString, IsInt, IsOptional, IsBoolean, IsDateString, IsNumber } from 'class-validator';

export class CreateDismantleDto {
  @IsInt()
  projectId: number;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsString()
  @IsOptional()
  depositStatus?: string;

  @IsNumber()
  @IsOptional()
  depositRefunded?: number;

  @IsNumber()
  @IsOptional()
  damageDeduction?: number;

  @IsString()
  @IsOptional()
  damageDescription?: string;

  @IsBoolean()
  @IsOptional()
  wasteCleared?: boolean;

  @IsNumber()
  @IsOptional()
  wasteFee?: number;

  @IsString()
  @IsOptional()
  wasteCompany?: string;

  @IsString()
  @IsOptional()
  wasteReceiptNo?: string;

  @IsString()
  @IsOptional()
  inspector?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}
