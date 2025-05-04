import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Country } from './country.entity';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  code!: string;

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

  @ManyToOne(() => Country, (country: Country) => country.states, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @OneToMany(() => City, (city: City) => city.state)
  cities!: City[];
}
