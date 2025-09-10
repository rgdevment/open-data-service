import { IntersectionType } from '@nestjs/mapped-types';
import { ValidateDocumentDto } from './validate.document.dto';
import { ValidateEmailDto } from './validate.email.dto';

export class ValidateUserDto extends IntersectionType(ValidateEmailDto, ValidateDocumentDto) {}
