import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OtpPurpose } from '@libs/common';

export class RequestOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose!: OtpPurpose;
}
