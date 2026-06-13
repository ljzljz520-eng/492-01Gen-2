import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { DamagePhoto } from './damage-photo.entity';

export type DismantleStatus = 'pending' | 'in_progress' | 'damage_checked' | 'waste_cleared' | 'completed';
export type DepositStatus = 'paid' | 'refunded' | 'deducted' | 'pending';

@Entity('dismantles')
export class Dismantle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.dismantles, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number;

  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({
    type: 'text',
    default: 'pending',
  })
  status: DismantleStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  depositAmount: number;

  @Column({
    type: 'text',
    default: 'pending',
  })
  depositStatus: DepositStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  depositRefunded: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  damageDeduction: number;

  @Column({ type: 'text', nullable: true })
  damageDescription: string;

  @OneToMany(() => DamagePhoto, (photo) => photo.dismantle)
  damagePhotos: DamagePhoto[];

  @Column({ type: 'boolean', default: false })
  wasteCleared: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wasteFee: number;

  @Column({ type: 'text', nullable: true })
  wasteCompany: string;

  @Column({ type: 'text', nullable: true })
  wasteReceiptNo: string;

  @Column({ type: 'text', nullable: true })
  inspector: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
