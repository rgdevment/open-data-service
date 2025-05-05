import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IndicatorSubtypeEntity } from './indicator-subtype.entity';

@Entity('indicator_values')
@Unique(['subtype', 'recorded_date'])
export class IndicatorValueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IndicatorSubtypeEntity, (subtype) => subtype.values, { eager: true })
  @JoinColumn({ name: 'subtype_id' })
  subtype!: IndicatorSubtypeEntity;

  @Column('decimal', { precision: 15, scale: 2 })
  value!: number;

  @Column('text', { nullable: true })
  value_to_word?: string;

  @Column({ length: 10, default: 'CLP' })
  unit!: string;

  @Column({ length: 200, nullable: true })
  source?: string;

  @Column({ type: 'date' })
  recorded_date!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
