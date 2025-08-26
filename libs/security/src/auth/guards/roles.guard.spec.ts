import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@libs/common';
import { RolesGuard } from './roles.guard';

const createMockExecutionContext = (requestOverrides: object = {}): jest.Mocked<ExecutionContext> => {
  const mockRequest = {
    headers: {},
    user: null,
    ...requestOverrides,
  };

  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
  } as any;
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockExecutionContext();

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
  });

  it('should allow access if the user has the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({
      user: { roles: [Role.ADMIN, Role.USER] },
    });

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
  });

  it('should deny access if the user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({
      user: { roles: [Role.USER] },
    });

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(false);
  });

  it('should deny access if the user has no roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ user: { roles: [] } });

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(false);
  });

  it('should deny access if the user object is missing the roles property', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ user: {} });

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(false);
  });

  it('should throw an error if no user is on the request', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    const context = createMockExecutionContext({ user: null });

    expect(() => guard.canActivate(context)).toThrow();
  });
});
