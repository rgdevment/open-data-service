export const isValidChileanRUT = (rut: string): boolean => {
  if (!/^\d{1,8}-[\d|kK]$/.test(rut)) {
    return false;
  }

  const [rutBody, dv] = rut.split('-');
  let sum = 0;
  let multiplier = 2;

  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const calculatedDV = 11 - (sum % 11);
  const expectedDV = calculatedDV === 11 ? '0' : calculatedDV === 10 ? 'K' : calculatedDV.toString();

  return dv.toUpperCase() === expectedDV;
};
