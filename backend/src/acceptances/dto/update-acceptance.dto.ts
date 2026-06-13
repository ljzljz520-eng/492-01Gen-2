import { PartialType } from '@nestjs/mapped-types';
import { CreateAcceptanceDto } from './create-acceptance.dto';

export class UpdateAcceptanceDto extends PartialType(CreateAcceptanceDto) {}
