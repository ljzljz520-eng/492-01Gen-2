import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dismantle } from './dismantle.entity';

@Entity('damage_photos')
export class DamagePhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dismantle, (dismantle) => dismantle.damagePhotos)
  @JoinColumn({ name: 'dismantleId' })
  dismantle: Dismantle;

  @Column()
  dismantleId: number;

  @Column()
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
