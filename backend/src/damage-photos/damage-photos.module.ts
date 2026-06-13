import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamagePhoto } from '../entities/damage-photo.entity';
import { DamagePhotosService } from './damage-photos.service';
import { DamagePhotosController } from './damage-photos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DamagePhoto])],
  controllers: [DamagePhotosController],
  providers: [DamagePhotosService],
  exports: [DamagePhotosService],
})
export class DamagePhotosModule {}
