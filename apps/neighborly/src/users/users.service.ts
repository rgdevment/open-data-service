import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { DocumentType, isValidChileanRUT, Role } from '@libs/common';
import { RegisterDto } from '../auth/dtos/register.dto';
import { isEmail } from 'class-validator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { RedisCacheService } from '@libs/cache';
import { ChangeEmailDto } from '../auth/dtos/change-email-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    private readonly dataSource: DataSource,
    private readonly cacheService: RedisCacheService,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    const { email, otp } = registerDto;
    const otpKey = `otp:${email}`;
    const attemptsKey = `otp_attempts:${email}`;

    const storedOtp = await this.cacheService.get<string>(otpKey);
    const attempts = (await this.cacheService.get<number>(attemptsKey)) ?? 0;

    if (!storedOtp) {
      throw new BadRequestException('Invalid or expired OTP. Please request a new one.');
    }

    if (storedOtp !== otp) {
      const newAttempts = attempts + 1;
      if (newAttempts >= 3) {
        await this.cacheService.del(otpKey);
        await this.cacheService.del(attemptsKey);
        throw new BadRequestException('Too many incorrect attempts. Please request a new OTP.');
      }
      await this.cacheService.set(attemptsKey, newAttempts, 300);
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    await this.cacheService.del(otpKey);
    await this.cacheService.del(attemptsKey);

    const { documentValue, documentType } = registerDto;
    const normalizedRUT = documentValue.toUpperCase();
    if (documentType === DocumentType.RUT) {
      if (!isValidChileanRUT(normalizedRUT)) {
        throw new BadRequestException('The provided RUT is not valid.');
      }
    }

    const createdUserInTransaction = await this.dataSource.transaction(async (manager) => {
      const { password } = registerDto;

      const existingUser = await manager.findOne(UserEntity, { where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const existingProfile = await manager.findOne(ProfileEntity, {
        where: { documentType, documentValue: normalizedRUT },
      });
      if (existingProfile) {
        throw new ConflictException('Document type and value combination already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = manager.create(UserEntity, {
        email,
        password: hashedPassword,
        roles: [Role.USER],
      });
      const newProfile = manager.create(ProfileEntity, {
        ...registerDto,
        documentValue: normalizedRUT,
        user: newUser,
      });

      const savedProfile = await manager.save(newProfile);
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

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserEntity> {
    const profile = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    if (dto.firstName) {
      profile.firstName = dto.firstName;
    }
    if (dto.lastName) {
      profile.lastName = dto.lastName;
    }

    await this.profilesRepository.save(profile);

    return this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['profile'],
    });
  }

  async changeEmail(userId: string, dto: ChangeEmailDto): Promise<void> {
    const { newEmail, currentPassword, otp } = dto;

    const otpKey = `otp:${newEmail}`;
    const storedOtp = await this.cacheService.get<string>(otpKey);
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP for the new email.');
    }

    const emailExists = await this.usersRepository.findOne({ where: { email: newEmail } });
    if (emailExists) {
      throw new ConflictException('New email address is already in use.');
    }

    const currentUser = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!currentUser || !currentUser.password) {
      throw new NotFoundException('User not found or password not set.');
    }

    const isPasswordMatching = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid current password.');
    }

    currentUser.email = newEmail;
    await this.usersRepository.save(currentUser);

    await this.cacheService.del(otpKey);
    await this.cacheService.del(`otp_attempts:${newEmail}`);
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    const isUsernameAnEmail = isEmail(username);
    const isUsernameARutFormat = /^\d{1,8}-[\d|kK]$/.test(username);

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    queryBuilder.leftJoinAndSelect('user.profile', 'profile').addSelect('user.password');

    if (isUsernameAnEmail) {
      queryBuilder.where('user.email = :username', { username });
    } else if (isUsernameARutFormat) {
      const normalizedRUT = username.toUpperCase();
      queryBuilder
        .innerJoin('user.profile', 'p')
        .where('p.documentType = :documentType', { documentType: DocumentType.RUT })
        .andWhere('p.documentValue = :documentValue', { documentValue: normalizedRUT });
    } else {
      return null;
    }

    return queryBuilder.getOne();
  }
}
