import { Role } from '@libs/common';
import { User as IUser } from '@libs/users';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({
    type: 'simple-array',
    default: Role.USER,
  })
  roles!: Role[];

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile!: ProfileEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
