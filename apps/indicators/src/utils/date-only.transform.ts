import type { TransformFnParams } from 'class-transformer';

export function DateOnlyTransform({ value }: TransformFnParams): string | undefined {
  if (!value) return undefined;
  try {
    if (typeof value === 'string') {
      return value.split('T')[0];
    }
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return undefined;
  } catch {
    return undefined;
  }
}
