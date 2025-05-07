import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class BotDetectorMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    const path = (req.path ?? req.url ?? '').toLowerCase();
    const userAgent = (req.headers?.['user-agent'] ?? '').toLowerCase();

    // Irrelevant routes not used in an API
    const IGNORED_EXACT_PATHS = ['/', '/favicon.ico', '/robots.txt', '/.git', '/.env'];

    // user-agents bots/automatic scrapers
    const SUSPICIOUS_UAS = ['wget', 'scrapy', 'python', 'java', 'go-http-client', 'httpclient'];

    if (IGNORED_EXACT_PATHS.includes(path)) {
      console.log(`Ignored path: ${path}`);
      res.statusCode = 204;
      res.end();
      return;
    }

    // We block only if: jar route ua bot
    if (SUSPICIOUS_UAS.some((ua) => userAgent.includes(ua)) && path.length < 4) {
      console.warn(`Blocked suspicious bot: IP=${req.ip}, UA=${userAgent}, path=${path}`);
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Forbidden' }));
      return;
    }

    next();
  }
}
