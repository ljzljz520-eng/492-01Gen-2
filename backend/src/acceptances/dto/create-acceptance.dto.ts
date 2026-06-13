import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateAcceptanceDto {
  @IsInt()
  projectId: number;

  @IsDateString()
  inspectionTime: string;

  @IsString()
  @IsOptional()
  inspector?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  woodworkQuality?: string;

  @IsString()
  @IsOptional()
  electricalSafety?: string;

  @IsString()
  @IsOptional()
  decorationQuality?: string;

  @IsString()
  @IsOptional()
  fireSafety?: string;

  @IsString()
  @IsOptional()
  overallScore?: string;

  @IsString()
  @IsOptional()
  issues?: string;

  @IsString()
  @IsOptional()
  rectificationDeadline?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}
