import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long.' })
  @IsNotEmpty()
  otp!: string;
}
