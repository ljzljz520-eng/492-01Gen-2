import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Worker } from './worker.entity';

export type ScheduleShift = 'morning' | 'afternoon' | 'night';
export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.schedules, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number;

  @ManyToOne(() => Worker, (worker) => worker.schedules, { eager: true })
  @JoinColumn({ name: 'workerId' })
  worker: Worker;

  @Column()
  workerId: number;

  @Column({ type: 'date' })
  workDate: string;

  @Column({
    type: 'text',
  })
  shift: ScheduleShift;

  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  workContent: string;

  @Column({
    type: 'text',
    default: 'scheduled',
  })
  status: ScheduleStatus;

  @Column({ type: 'boolean', default: false })
  needTools: boolean;

  @Column({ type: 'text', nullable: true })
  tools: string;

  @Column({ type: 'boolean', default: false })
  nightWork: boolean;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
