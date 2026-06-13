import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Project } from './entities/project.entity';
import { Worker } from './entities/worker.entity';
import { Schedule } from './entities/schedule.entity';
import { Acceptance } from './entities/acceptance.entity';
import { Dismantle } from './entities/dismantle.entity';
import { DamagePhoto } from './entities/damage-photo.entity';
import { HallsModule } from './halls/halls.module';
import { ProjectsModule } from './projects/projects.module';
import { WorkersModule } from './workers/workers.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AcceptancesModule } from './acceptances/acceptances.module';
import { DismantlesModule } from './dismantles/dismantles.module';
import { DamagePhotosModule } from './damage-photos/damage-photos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/exhibition.db',
      entities: [Hall, Project, Worker, Schedule, Acceptance, Dismantle, DamagePhoto],
      synchronize: true,
    }),
    HallsModule,
    ProjectsModule,
    WorkersModule,
    SchedulesModule,
    AcceptancesModule,
    DismantlesModule,
    DamagePhotosModule,
  ],
})
export class AppModule {}
