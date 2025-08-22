import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateUserCredentialsDto } from '@libs/users';

export class RegisterDto extends CreateUserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  documentType!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,8}-[\d|kK]$/)
  documentValue!: string;
}
