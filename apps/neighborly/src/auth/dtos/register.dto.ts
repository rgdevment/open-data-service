import { CreateUserCredentialsDto } from '@libs/users';
import { DocumentType } from '@libs/common';
import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto extends CreateUserCredentialsDto {
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long.' })
  @IsNotEmpty()
  otp!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType!: DocumentType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,8}-[\d|kK]$/)
  documentValue!: string;
}
