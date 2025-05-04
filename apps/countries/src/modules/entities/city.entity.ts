import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  state_id!: number;

  @Column()
  country_id!: number;

  @Column({ nullable: true, type: 'double' })
  latitude!: number;

  @Column({ nullable: true, type: 'double' })
  longitude!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state!: State;

  @ManyToOne(() => Country, (country) => country.cities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country!: Country;
}
