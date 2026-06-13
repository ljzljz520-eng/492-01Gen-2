import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acceptance } from '../entities/acceptance.entity';
import { AcceptancesService } from './acceptances.service';
import { AcceptancesController } from './acceptances.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Acceptance])],
  controllers: [AcceptancesController],
  providers: [AcceptancesService],
  exports: [AcceptancesService],
})
export class AcceptancesModule {}
