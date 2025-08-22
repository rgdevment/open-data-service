import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateUserCredentialsDto } from '@libs/users';
import { DocumentType } from '@libs/common';

export class RegisterDto extends CreateUserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEnum(DocumentType, { message: 'Invalid document type.' })
  @IsNotEmpty()
  documentType!: DocumentType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,8}-[\d|kK]$/)
  documentValue!: string;
}
