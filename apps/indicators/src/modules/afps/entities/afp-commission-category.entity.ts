import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AfpCommissionEntity } from './afp-commission.entity';

@Entity('afp_commission_categories')
export class AfpCommissionCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @OneToMany(() => AfpCommissionEntity, (commission) => commission.category)
  commissions!: AfpCommissionEntity[];
}
