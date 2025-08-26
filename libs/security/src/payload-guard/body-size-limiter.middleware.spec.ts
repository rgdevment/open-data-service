import { PayloadTooLargeException, UnsupportedMediaTypeException } from '@nestjs/common';
import { BodySizeLimiterMiddleware } from './body-size-limiter.middleware';

describe('BodySizeLimiterMiddleware', () => {
  let middleware: BodySizeLimiterMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new BodySizeLimiterMiddleware();
    nextFunction = jest.fn();
    mockResponse = {};
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('when handling methods without a body', () => {
    it('should call next() for GET requests without validation', () => {
      mockRequest = { method: 'GET', headers: {} };
      middleware.use(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('when handling methods with a body', () => {
    it('should call next() for a valid POST request', () => {
      mockRequest = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': '1024',
        },
      };
      middleware.use(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it('should throw UnsupportedMediaTypeException for invalid content-type', () => {
      mockRequest = {
        method: 'POST',
        headers: {
          'content-type': 'text/plain',
          'content-length': '1024',
        },
      };
      expect(() => middleware.use(mockRequest, mockResponse, nextFunction)).toThrow(UnsupportedMediaTypeException);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported content-type'));
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should throw PayloadTooLargeException for oversized body', () => {
      mockRequest = {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'content-length': '200000',
        },
      };
      expect(() => middleware.use(mockRequest, mockResponse, nextFunction)).toThrow(PayloadTooLargeException);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Body too large'));
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle content-type with charset gracefully', () => {
      mockRequest = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'content-length': '1024',
        },
      };
      middleware.use(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('when handling requests with missing properties', () => {
    it('should throw UnsupportedMediaTypeException if content-type is missing', () => {
      mockRequest = {
        method: 'POST',
        headers: { 'content-length': '1024' },
      };
      expect(() => middleware.use(mockRequest, mockResponse, nextFunction)).toThrow(
        new UnsupportedMediaTypeException('Unsupported content-type: '),
      );
    });

    it('should call next() if content-length is missing (defaults to 0)', () => {
      mockRequest = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      };
      middleware.use(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it('should call next() if method is missing (defaults to GET)', () => {
      mockRequest = { headers: {} };
      middleware.use(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it('should log with "unknown" IP if ip is missing on a failed request', () => {
      mockRequest = {
        method: 'POST',
        ip: undefined,
        headers: { 'content-type': 'text/plain' },
      };
      expect(() => middleware.use(mockRequest, mockResponse, nextFunction)).toThrow(UnsupportedMediaTypeException);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('IP: unknown'));
    });
  });
});
