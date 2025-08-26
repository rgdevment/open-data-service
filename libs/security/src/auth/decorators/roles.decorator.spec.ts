import { SetMetadata } from '@nestjs/common';
import { Role } from '@libs/common';
import { ROLES_KEY, Roles } from './roles.decorator';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Roles Decorator', () => {
  const mockedSetMetadata = jest.mocked(SetMetadata);

  beforeEach(() => {
    mockedSetMetadata.mockClear();
  });

  it('should export the correct ROLES_KEY constant', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('should call SetMetadata with the correct key and roles array', () => {
    const rolesToApply = [Role.ADMIN, Role.USER];
    Roles(...rolesToApply);

    expect(mockedSetMetadata).toHaveBeenCalledTimes(1);
    expect(mockedSetMetadata).toHaveBeenCalledWith(ROLES_KEY, rolesToApply);
  });
});
