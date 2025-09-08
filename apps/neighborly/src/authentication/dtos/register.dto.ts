import { CreateUserCredentialsDto } from '@libs/users';
import { DocumentType, IsRut } from '@libs/common';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

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
  @IsRut()
  documentValue!: string;
}
