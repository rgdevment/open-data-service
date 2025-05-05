import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AfpCommissionEntity } from './afp-commission.entity';

@Entity('afp_entities')
export class AfpEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => AfpCommissionEntity, (commission) => commission.afp)
  commissions!: AfpCommissionEntity[];
}
