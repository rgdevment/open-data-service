import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AfpCommissionEntity } from './afp-commission.entity';

@Entity('afp_commission_subcategories')
export class AfpCommissionSubcategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @OneToMany(() => AfpCommissionEntity, (commission) => commission.subcategory)
  commissions!: AfpCommissionEntity[];
}
