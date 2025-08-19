import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Role } from '@libs/security';
import { DocumentType } from '../enums/document-type.enum';

@Entity({ name: 'users' })
@Unique(['documentType', 'documentValue'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: DocumentType })
  documentType!: DocumentType;

  @Column()
  documentValue!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  phone!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({
    type: 'simple-json',
    default: [Role.NEIGHBOR],
  })
  roles!: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}
