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
import { DocumentType, isValidChileanRUT, OtpPurpose, Role } from '@libs/common';
import { RegisterDto } from '../authentication/dtos/register.dto';
import { isEmail } from 'class-validator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangeEmailDto } from '../authentication/dtos/change-email-request.dto';
import { OtpService } from '@libs/otp';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ValidateEmailDto } from '../authentication/dtos/validate.email.dto';
import { ValidateDocumentDto } from '../authentication/dtos/validate.document.dto';
import { ValidateUserDto } from '../authentication/dtos/validate.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>,
    private readonly dataSource: DataSource,
    private readonly otpService: OtpService,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    const { email, otp } = registerDto;

    await this.otpService.validateOtp(email, otp, OtpPurpose.REGISTRATION);

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

  async validateEmail(validateEmailDto: ValidateEmailDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: validateEmailDto.email },
    });
    if (!user) {
      throw new NotFoundException('User with provided email not found.');
    }
    return user;
  }

  async validateDocument(validateDocumentDto: ValidateDocumentDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        profile: {
          documentValue: validateDocumentDto.documentValue,
          documentType: validateDocumentDto.documentType,
        },
      },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User with provided document not found.');
    }
    return user;
  }

  async validateUserByEmailOrDocument(validateUserDto: ValidateUserDto): Promise<UserEntity> {
    const { email, documentValue, documentType } = validateUserDto;

    const user = await this.usersRepository.findOne({
      where: [
        { email: email },
        {
          profile: {
            documentValue: documentValue,
            documentType: documentType,
          },
        },
      ],
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User with provided email or document not found.');
    }

    return user;
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

    await this.otpService.validateOtp(newEmail, otp, OtpPurpose.EMAIL_CHANGE);

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
  }

  async softDeleteUser(userId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
        relations: ['profile'],
      });

      if (!user) {
        return;
      }

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      const anonymizedSuffix = `_deleted_${year}${month}${day}${hours}${minutes}`;

      const profile = user.profile;

      user.email = `${user.email}${anonymizedSuffix}`;

      if (profile) {
        profile.documentValue = `${profile.documentValue}${anonymizedSuffix}`;
        profile.deletedAt = now;
        await manager.save(profile);
      }

      user.deletedAt = now;
      await manager.save(user);
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = dto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user || !user.password) {
      throw new NotFoundException('User not found.');
    }

    const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid current password.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);
  }

  async findOneByIdWithProfile(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneByUsernameWithPassword(username: string): Promise<UserEntity | null> {
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
