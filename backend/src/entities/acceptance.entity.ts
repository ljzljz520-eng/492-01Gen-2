import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

export type AcceptanceStatus = 'pending' | 'passed' | 'failed' | 'recheck';

@Entity('acceptances')
export class Acceptance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.acceptances, { eager: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number;

  @Column({ type: 'datetime' })
  inspectionTime: Date;

  @Column({ type: 'text', nullable: true })
  inspector: string;

  @Column({
    type: 'text',
    default: 'pending',
  })
  status: AcceptanceStatus;

  @Column({ type: 'text', nullable: true })
  woodworkQuality: string;

  @Column({ type: 'text', nullable: true })
  electricalSafety: string;

  @Column({ type: 'text', nullable: true })
  decorationQuality: string;

  @Column({ type: 'text', nullable: true })
  fireSafety: string;

  @Column({ type: 'text', nullable: true })
  overallScore: string;

  @Column({ type: 'text', nullable: true })
  issues: string;

  @Column({ type: 'text', nullable: true })
  rectificationDeadline: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
