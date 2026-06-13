import { IsString, IsInt, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  projectId: number;

  @IsInt()
  workerId: number;

  @IsDateString()
  workDate: string;

  @IsString()
  shift: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  workContent?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  needTools?: boolean;

  @IsString()
  @IsOptional()
  tools?: string;

  @IsBoolean()
  @IsOptional()
  nightWork?: boolean;

  @IsString()
  @IsOptional()
  remark?: string;
}
