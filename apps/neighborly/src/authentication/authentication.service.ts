import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType, isValidChileanRUT, OtpPurpose, Role } from '@libs/common';
import { OtpService } from '@libs/otp';
import { MailingService } from '@libs/mailing';
import { RegisterDto } from './dtos/register.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ProfileEntity } from '../users/entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUserDto } from './dtos/validate.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly mailingService: MailingService,
    private readonly otpService: OtpService,
    private readonly dataSource: DataSource,
  ) {}

  async requestOtp(email: string, purpose: OtpPurpose): Promise<void> {
    const otp = await this.otpService.generateAndStoreOtp(email, purpose);

    await this.mailingService.sendEmail({
      to: email,
      subject: `Tu código para Vecinal App: ${otp}`,
      text: `Usa este código para registrarte: ${otp}. Expira en 10 minutos.`,
      html: `<p>Tu código es: <strong>${otp}</strong>. Expira en 10 minutos.</p>`,
    });
  }

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
}
