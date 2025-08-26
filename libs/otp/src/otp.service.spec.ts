import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { ConfigType } from '@nestjs/config';
import { RedisCacheService } from '@libs/cache';
import { OtpService } from './otp.service';
import { otpConfig } from './config/otp.config';
import { OtpPurpose } from '@libs/common';
import { BadRequestException } from '@nestjs/common';

const mockCacheService = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

const mockOtpConfig: ConfigType<typeof otpConfig> = {
  ttl: 300,
  attempts: 3,
};

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: RedisCacheService,
          useValue: mockCacheService,
        },
        {
          provide: otpConfig.KEY,
          useValue: mockOtpConfig,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAndStoreOtp', () => {
    it('should generate a 6-digit OTP and store it in the cache', async () => {
      const email = 'test@example.com';
      const purpose = OtpPurpose.REGISTRATION;

      const otp = await service.generateAndStoreOtp(email, purpose);

      expect(otp).toHaveLength(6);
      expect(otp).toMatch(/^\d{6}$/);
      expect(mockCacheService.set).toHaveBeenCalledTimes(2);
      expect(mockCacheService.set).toHaveBeenCalledWith(`${purpose}:${email}`, otp, mockOtpConfig.ttl);
      expect(mockCacheService.set).toHaveBeenCalledWith(`${purpose}_attempts:${email}`, 0, mockOtpConfig.ttl);
    });
  });

  describe('validateOtp', () => {
    const email = 'test@example.com';
    const purpose = OtpPurpose.REGISTRATION;
    const correctOtp = '123456';
    const incorrectOtp = '654321';
    const otpKey = `${purpose}:${email}`;
    const attemptsKey = `${purpose}_attempts:${email}`;

    it('should validate correctly if the OTP is valid', async () => {
      mockCacheService.get.mockResolvedValueOnce(correctOtp).mockResolvedValueOnce(0);

      await expect(service.validateOtp(email, correctOtp, purpose)).resolves.toBeUndefined();

      expect(mockCacheService.del).toHaveBeenCalledTimes(2);
      expect(mockCacheService.del).toHaveBeenCalledWith(otpKey);
      expect(mockCacheService.del).toHaveBeenCalledWith(attemptsKey);
    });

    it('should throw an error and increment attempts for an invalid OTP', async () => {
      mockCacheService.get.mockResolvedValueOnce(correctOtp).mockResolvedValueOnce(0);

      await expect(service.validateOtp(email, incorrectOtp, purpose)).rejects.toThrow(
        new BadRequestException('Invalid OTP. Please try again.'),
      );

      expect(mockCacheService.set).toHaveBeenCalledTimes(1);
      expect(mockCacheService.set).toHaveBeenCalledWith(attemptsKey, 1, mockOtpConfig.ttl);
      expect(mockCacheService.del).not.toHaveBeenCalled();
    });

    it('should throw an error and delete keys on too many incorrect attempts', async () => {
      const lastAttempt = mockOtpConfig.attempts - 1;
      mockCacheService.get.mockResolvedValueOnce(correctOtp).mockResolvedValueOnce(lastAttempt);

      await expect(service.validateOtp(email, incorrectOtp, purpose)).rejects.toThrow(
        new BadRequestException('Too many incorrect attempts. Please request a new OTP.'),
      );

      expect(mockCacheService.del).toHaveBeenCalledTimes(2);
      expect(mockCacheService.del).toHaveBeenCalledWith(otpKey);
      expect(mockCacheService.del).toHaveBeenCalledWith(attemptsKey);
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should throw an error if the OTP has expired or does not exist', async () => {
      mockCacheService.get.mockResolvedValueOnce(null);

      await expect(service.validateOtp(email, correctOtp, purpose)).rejects.toThrow(
        new BadRequestException('Invalid or expired OTP. Please request a new one.'),
      );

      expect(mockCacheService.del).not.toHaveBeenCalled();
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });
  });
});
