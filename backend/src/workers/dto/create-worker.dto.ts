import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  idCard?: string;

  @IsBoolean()
  @IsOptional()
  hasCertificate?: boolean;

  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @IsDateString()
  @IsOptional()
  certificateExpiry?: string;

  @IsBoolean()
  @IsOptional()
  hasNightWorkPermit?: boolean;

  @IsDateString()
  @IsOptional()
  nightWorkPermitExpiry?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  skills?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}
