import { HoneypotMiddleware } from './honeypot.middleware';

describe('HoneypotMiddleware', () => {
  let middleware: HoneypotMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new HoneypotMiddleware();
    nextFunction = jest.fn();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    let finishCallback: () => void;
    mockResponse = {
      statusCode: 200,
      on: (event: string, callback: () => void) => {
        if (event === 'finish') {
          finishCallback = callback;
        }
      },
      _simulateFinish: () => {
        if (finishCallback) {
          finishCallback();
        }
      },
    };
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should always call the next function', () => {
    mockRequest = { originalUrl: '/', headers: {}, ip: '127.0.0.1' };
    middleware.use(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  describe('on response finish', () => {
    it('should log a warning if a honeypot path is accessed with a 404 status', () => {
      mockRequest = {
        originalUrl: '/wp-admin',
        headers: { 'user-agent': 'test-bot' },
        ip: '127.0.0.1',
      };
      mockResponse.statusCode = 404;

      middleware.use(mockRequest, mockResponse, nextFunction);
      mockResponse._simulateFinish();

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Honeypot triggered at "wp-admin"'));
    });

    it('should correctly parse a path with a query string', () => {
      mockRequest = {
        originalUrl: '/login?user=admin',
        headers: {},
        ip: '127.0.0.1',
      };
      mockResponse.statusCode = 404;

      middleware.use(mockRequest, mockResponse, nextFunction);
      mockResponse._simulateFinish();

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Honeypot triggered at "login"'));
    });

    it('should NOT log a warning if the status code is not 404', () => {
      mockRequest = {
        originalUrl: '/wp-admin',
        headers: {},
        ip: '127.0.0.1',
      };
      mockResponse.statusCode = 200;

      middleware.use(mockRequest, mockResponse, nextFunction);
      mockResponse._simulateFinish();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should NOT log a warning if the path is not a honeypot path', () => {
      mockRequest = {
        originalUrl: '/some-other-page',
        headers: {},
        ip: '127.0.0.1',
      };
      mockResponse.statusCode = 404;

      middleware.use(mockRequest, mockResponse, nextFunction);
      mockResponse._simulateFinish();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
