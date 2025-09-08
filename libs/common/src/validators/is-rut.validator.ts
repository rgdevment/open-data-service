import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isRut', async: false })
export class IsRutConstraint implements ValidatorConstraintInterface {
  validate(rut: string, _args: ValidationArguments): boolean {
    const cleanRut = rut.replace(/\./g, '').replace('-', '');
    if (!/^\d{7,8}[0-9kK]$/.test(cleanRut)) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }
    const expectedDv = 11 - (sum % 11);
    const expectedDvStr = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

    return dv === expectedDvStr;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'El RUT ingresado no es válido';
  }
}
