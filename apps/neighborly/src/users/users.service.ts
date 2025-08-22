import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { DocumentType, isValidChileanRUT, Role } from '@libs/common';
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
    const normalizedRUT = registerDto.documentValue.toUpperCase();

    if (registerDto.documentType === DocumentType.RUT) {
      if (!isValidChileanRUT(normalizedRUT)) {
        throw new BadRequestException('The provided RUT is not valid.');
      }
    }

    const createdUserInTransaction = await this.dataSource.transaction(async (transactionalEntityManager) => {
      const { email, password, documentType } = registerDto;

      const existingUser = await transactionalEntityManager.findOne(UserEntity, {
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const existingProfile = await transactionalEntityManager.findOne(ProfileEntity, {
        where: { documentType, documentValue: normalizedRUT },
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
        documentValue: normalizedRUT,
        user: newUser,
      });

      const savedProfile = await transactionalEntityManager.save(newProfile);
      return savedProfile.user;
    });

    const completeUser = await this.usersRepository.findOne({
      where: { id: createdUserInTransaction.id },
      relations: ['profile'],
    });

    if (!completeUser) {
      throw new InternalServerErrorException('Could not fetch user after creation.');
    }

    delete completeUser.password;
    return completeUser;
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
