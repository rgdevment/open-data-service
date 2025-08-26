import { ConcurrencyService } from './concurrency.service';

describe('ConcurrencyService', () => {
  let service: ConcurrencyService;

  beforeEach(() => {
    service = new ConcurrencyService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enter', () => {
    it('should return true for the first request from an IP', () => {
      expect(service.enter('127.0.0.1')).toBe(true);
    });

    it('should return true for requests up to the concurrent limit', () => {
      expect(service.enter('127.0.0.1')).toBe(true);
      expect(service.enter('127.0.0.1')).toBe(true);
      expect(service.enter('127.0.0.1')).toBe(true);
    });

    it('should return false for requests exceeding the concurrent limit', () => {
      service.enter('127.0.0.1');
      service.enter('127.0.0.1');
      service.enter('127.0.0.1');
      expect(service.enter('127.0.0.1')).toBe(false);
    });

    it('should handle different IPs independently', () => {
      expect(service.enter('127.0.0.1')).toBe(true);
      expect(service.enter('192.168.1.1')).toBe(true);
      expect(service.enter('127.0.0.1')).toBe(true);
      expect(service.enter('192.168.1.1')).toBe(true);
    });
  });

  describe('exit', () => {
    it('should decrement the count for an existing IP', () => {
      const ip = '127.0.0.1';
      service.enter(ip);
      service.enter(ip);
      service.exit(ip);
      expect(service.enter(ip)).toBe(true);
      expect(service.enter(ip)).toBe(true);
      expect(service.enter(ip)).toBe(false);
    });

    it('should not throw an error if exiting an unknown IP', () => {
      expect(() => service.exit('127.0.0.1')).not.toThrow();
    });

    it('should not decrement the count below zero', () => {
      const ip = '127.0.0.1';
      service.enter(ip);
      service.exit(ip);
      service.exit(ip);
      expect(service.enter(ip)).toBe(true);
    });

    it('should allow re-entry after a slot is freed', () => {
      const ip = '127.0.0.1';
      service.enter(ip);
      service.enter(ip);
      service.enter(ip);
      expect(service.enter(ip)).toBe(false);

      service.exit(ip);
      expect(service.enter(ip)).toBe(true);
    });
  });
});
