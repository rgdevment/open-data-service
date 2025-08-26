import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
  const mockedSetMetadata = jest.mocked(SetMetadata);

  beforeEach(() => {
    mockedSetMetadata.mockClear();
  });

  it('should call SetMetadata with the correct key and value', () => {
    Public();
    expect(mockedSetMetadata).toHaveBeenCalledTimes(1);
    expect(mockedSetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should export the correct IS_PUBLIC_KEY constant', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });
});
