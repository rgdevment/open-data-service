import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
@Index(['documentType', 'documentValue'], { unique: true })
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  documentType!: string;

  @Column()
  documentValue!: string;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
