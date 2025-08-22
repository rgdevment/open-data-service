import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { Role } from '@libs/common';
import { RegisterDto } from '../auth/dtos/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const { email, password, documentType, documentValue } = registerDto;

      const existingUser = await transactionalEntityManager.findOne(UserEntity, {
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const existingProfile = await transactionalEntityManager.findOne(ProfileEntity, {
        where: { documentType, documentValue },
      });
      if (existingProfile) {
        throw new ConflictException('Document type and value combination already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = transactionalEntityManager.create(UserEntity, {
        email,
        password: hashedPassword,
        roles: [Role.USER],
      });

      const newProfile = transactionalEntityManager.create(ProfileEntity, {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        documentType: registerDto.documentType,
        documentValue: registerDto.documentValue,
        user: newUser,
      });

      await transactionalEntityManager.save(newProfile);

      delete newUser.password;
      return newUser;
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async findProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    return this.profilesRepository.findOne({ where: { user: { id: userId } } });
  }
}
