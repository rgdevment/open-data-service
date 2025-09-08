import { Validate } from 'class-validator';
import { IsRutConstraint } from './is-rut.validator';

export function IsRut(): PropertyDecorator {
  return Validate(IsRutConstraint);
}
