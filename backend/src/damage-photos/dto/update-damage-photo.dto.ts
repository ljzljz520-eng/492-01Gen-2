import { PartialType } from '@nestjs/mapped-types';
import { CreateDamagePhotoDto } from './create-damage-photo.dto';

export class UpdateDamagePhotoDto extends PartialType(CreateDamagePhotoDto) {}
