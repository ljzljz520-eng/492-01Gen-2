import { PartialType } from '@nestjs/mapped-types';
import { CreateDismantleDto } from './create-dismantle.dto';

export class UpdateDismantleDto extends PartialType(CreateDismantleDto) {}
