import { Injectable, NestMiddleware, PayloadTooLargeException, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class BodySizeLimiterMiddleware implements NestMiddleware {
  private readonly maxBodySize = 100 * 1024; // 100 KB
  private readonly allowedContentTypes = ['application/json'];

  use(req: any, _res: any, next: () => void): void {
    const contentLength = parseInt(req.headers?.['content-length'] ?? '0', 10);
    const contentType = req.headers?.['content-type']?.split(';')[0] ?? '';
    const ip = req.ip ?? 'unknown';
    const method = req.method?.toUpperCase() ?? 'GET';

    // Only validate methods that are expected to have a body
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];

    if (methodsWithBody.includes(method)) {
      if (this.allowedContentTypes.length && !this.allowedContentTypes.includes(contentType)) {
        console.warn(`[PAYLOAD] ❌ Unsupported content-type "${contentType}" — IP: ${ip}`);
        throw new UnsupportedMediaTypeException(`Unsupported content-type: ${contentType}`);
      }

      if (contentLength > this.maxBodySize) {
        console.warn(`[PAYLOAD] ❌ Body too large: ${contentLength} bytes — IP: ${ip}`);
        throw new PayloadTooLargeException('Request body is too large');
      }
    }

    next();
  }
}
