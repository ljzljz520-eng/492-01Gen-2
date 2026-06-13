import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Hall } from './hall.entity';
import { Schedule } from './schedule.entity';
import { Acceptance } from './acceptance.entity';
import { Dismantle } from './dismantle.entity';

export type ProjectStatus = 'pending' | 'in_progress' | 'accepted' | 'dismantling' | 'completed';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  boothNumber: string;

  @Column({ type: 'int', default: 0 })
  boothArea: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Hall, (hall) => hall.projects, { eager: true })
  @JoinColumn({ name: 'hallId' })
  hall: Hall;

  @Column()
  hallId: number;

  @Column({ type: 'datetime' })
  entryTime: Date;

  @Column({ type: 'datetime' })
  buildDeadline: Date;

  @Column({ type: 'datetime', nullable: true })
  dismantleStartTime: Date;

  @Column({ type: 'int', default: 0 })
  carpenterNeeded: number;

  @Column({ type: 'int', default: 0 })
  electricianNeeded: number;

  @Column({ type: 'int', default: 0 })
  decoratorNeeded: number;

  @Column({ type: 'int', default: 0 })
  forkliftNeeded: number;

  @Column({ type: 'boolean', default: false })
  nightWorkRequired: boolean;

  @Column({
    type: 'text',
    default: 'pending',
  })
  status: ProjectStatus;

  @Column({ type: 'text', nullable: true })
  projectManager: string;

  @Column({ type: 'text', nullable: true })
  clientName: string;

  @OneToMany(() => Schedule, (schedule) => schedule.project)
  schedules: Schedule[];

  @OneToMany(() => Acceptance, (acceptance) => acceptance.project)
  acceptances: Acceptance[];

  @OneToMany(() => Dismantle, (dismantle) => dismantle.project)
  dismantles: Dismantle[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
