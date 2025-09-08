import { otpConfig } from './otp.config';

describe('otpConfig', () => {
  it('should be a function', () => {
    expect(typeof otpConfig).toBe('function');
  });

  it('should return the correct configuration object when called', () => {
    const config = otpConfig();

    expect(config).toEqual({
      ttl: 600,
      attempts: 3,
    });
  });
});
