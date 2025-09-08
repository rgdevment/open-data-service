import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType, IsRut } from '@libs/common';

export class ValidateDocumentDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType!: DocumentType;

  @IsString()
  @IsNotEmpty()
  @IsRut()
  documentValue!: string;
}
