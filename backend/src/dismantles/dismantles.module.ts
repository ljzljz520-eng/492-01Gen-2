import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dismantle } from '../entities/dismantle.entity';
import { DismantlesService } from './dismantles.service';
import { DismantlesController } from './dismantles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dismantle])],
  controllers: [DismantlesController],
  providers: [DismantlesService],
  exports: [DismantlesService],
})
export class DismantlesModule {}
