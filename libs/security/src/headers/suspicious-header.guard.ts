import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SuspiciousHeaderGuard implements CanActivate {
  private readonly requiredHeaders = ['host', 'user-agent'];

  private readonly suspiciousHeaders = ['x-akismet-pro-tip', 'x-php-version', 'x-amzn-trace-id', 'x-forwarded-server'];

  private readonly knownHeaders = [
    'host',
    'user-agent',
    'accept',
    'accept-encoding',
    'accept-language',
    'connection',
    'if-none-match',
    'upgrade-insecure-requests',
    'cookie',
    'x-forwarded-for',
    'x-real-ip',
    'cf-ipcountry',
    'dnt',
    'sec-gpc',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'sec-fetch-user',
    'priority',
  ];

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers;
    const path = req.originalUrl;
    const ip = req.ip;

    const verbose = process.env.HEADER_GUARD_VERBOSE === 'true' || process.env.NODE_ENV === 'development';

    if (this.isBypassedPath(path)) {
      return true;
    }

    try {
      this.validateRequiredHeaders(headers, ip, path);

      if (verbose) {
        this.logSuspiciousHeaders(headers, ip, path);
        this.logUnknownHeaders(headers, ip, path);

        if (process.env.HEADER_GUARD_DEBUG === 'true') {
          console.debug(`[HEADERS] 🧾 Full header dump — IP: ${ip} Path: ${path}`, headers);
        }
      }

      return true;
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[HEADERS] ❌ Blocked by guard — IP: ${ip} Path: ${path}`, err.message);
      } else {
        console.error(`[HEADERS] ❌ Blocked by guard — IP: ${ip} Path: ${path}`, err);
      }
      throw err;
    }
  }

  private isBypassedPath(path: string): boolean {
    return ['/health', '/metrics'].includes(path);
  }

  private validateRequiredHeaders(headers: Record<string, string>, _ip: string, _path: string): void {
    for (const key of this.requiredHeaders) {
      if (!headers[key]) {
        throw new BadRequestException(`Missing required header: ${key}`);
      }
    }
  }

  private logSuspiciousHeaders(headers: Record<string, string>, ip: string, path: string): void {
    for (const key of this.suspiciousHeaders) {
      if (headers[key]) {
        console.debug(`[HEADERS] ⚠️ Suspicious header detected — ${key}: ${headers[key]} — IP: ${ip} Path: ${path}`);
      }
    }
  }

  private logUnknownHeaders(headers: Record<string, string>, ip: string, path: string): void {
    for (const key of Object.keys(headers)) {
      if (!this.knownHeaders.includes(key)) {
        console.debug(`[HEADERS] 🧩 Unknown header received — ${key}: ${headers[key]} — IP: ${ip} Path: ${path}`);
      }
    }
  }
}
