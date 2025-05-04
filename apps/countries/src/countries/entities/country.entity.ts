import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { State } from './state.entity';
import { City } from './city.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  capital!: string;

  @Column({ nullable: true, type: 'double' })
  latitude!: number;

  @Column({ nullable: true, type: 'double' })
  longitude!: number;

  @Column({ nullable: true })
  phone_code!: string;

  @Column({ nullable: true })
  region!: string;

  @Column({ nullable: true })
  subregion!: string;

  @Column({ nullable: true })
  tld!: string;

  @Column({ nullable: true })
  currency_code!: string;

  @Column({ nullable: true })
  currency_symbol!: string;

  @Column({ nullable: true })
  currency_name!: string;

  @Column({ nullable: true })
  flag_ico!: string;

  @Column({ nullable: true, type: 'text' })
  flag_alt!: string;

  @Column({ nullable: true, type: 'text' })
  flag_png!: string;

  @Column({ nullable: true, type: 'text' })
  flag_svg!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => State, (state: State) => state.country)
  states!: State[];

  @OneToMany(() => City, (city: City) => city.country)
  cities!: City[];
}
