import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Role } from '@libs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'test-secret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user from the JWT payload', () => {
      const payload = {
        sub: 'user-id-123',
        email: 'test@example.com',
        roles: [Role.USER],
      };

      const expectedUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        roles: [Role.USER],
      };

      const result = strategy.validate(payload);

      expect(result).toEqual(expectedUser);
    });
  });
});
