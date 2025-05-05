import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfpCommissionCategoryEntity } from './afp-commission-category.entity';
import { AfpCommissionSubcategoryEntity } from './afp-commission-subcategory.entity';
import { AfpEntity } from './afp.entity';

@Entity('afp_commissions')
export class AfpCommissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AfpEntity, (afp) => afp.commissions)
  @JoinColumn({ name: 'afp_id' })
  afp!: AfpEntity;

  @ManyToOne(() => AfpCommissionCategoryEntity, (cat) => cat.commissions)
  @JoinColumn({ name: 'category_id' })
  category!: AfpCommissionCategoryEntity;

  @ManyToOne(() => AfpCommissionSubcategoryEntity, (sub) => sub.commissions)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory!: AfpCommissionSubcategoryEntity;

  @Column('decimal', { precision: 10, scale: 6 })
  commission!: number;

  @Column({ nullable: true })
  source!: string;

  @Column({ type: 'date' })
  recorded_date!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
