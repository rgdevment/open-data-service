import { BotDetectorMiddleware } from './bot-detector.middleware';

describe('BotDetectorMiddleware', () => {
  let middleware: BotDetectorMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new BotDetectorMiddleware();
    nextFunction = jest.fn();
    mockResponse = {
      statusCode: 200,
      end: jest.fn(),
      setHeader: jest.fn(),
    };
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should end the response with 204 for an ignored path like /robots.txt', () => {
    mockRequest = { path: '/robots.txt', headers: {} };
    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.statusCode).toBe(204);
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Ignored path: /robots.txt');
  });

  it('should block a suspicious user-agent on a short path', () => {
    mockRequest = {
      path: '/',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'python-requests/2.28.1' },
    };
    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.statusCode).toBe(403);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Forbidden' }));
    expect(nextFunction).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Blocked suspicious bot'));
  });

  it('should allow a suspicious user-agent on a long path', () => {
    mockRequest = {
      path: '/some/long/path',
      headers: { 'user-agent': 'python-requests/2.28.1' },
    };
    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  it('should allow a normal user-agent on a short path', () => {
    mockRequest = {
      path: '/',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    };
    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  it('should handle missing user-agent and path gracefully', () => {
    mockRequest = { headers: {} };
    middleware.use(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
