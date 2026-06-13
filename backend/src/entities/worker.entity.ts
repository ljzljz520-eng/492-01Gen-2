import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

export type WorkerType = 'carpenter' | 'electrician' | 'decorator' | 'forklift_driver';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({
    type: 'text',
  })
  type: WorkerType;

  @Column({ type: 'text', nullable: true })
  idCard: string;

  @Column({ type: 'boolean', default: false })
  hasCertificate: boolean;

  @Column({ type: 'text', nullable: true })
  certificateNumber: string;

  @Column({ type: 'datetime', nullable: true })
  certificateExpiry: Date;

  @Column({ type: 'boolean', default: false })
  hasNightWorkPermit: boolean;

  @Column({ type: 'datetime', nullable: true })
  nightWorkPermitExpiry: Date;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'text', nullable: true })
  skills: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @OneToMany(() => Schedule, (schedule) => schedule.worker)
  schedules: Schedule[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
