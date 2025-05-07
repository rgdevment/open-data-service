import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HoneypotMiddleware implements NestMiddleware {
  private readonly honeypotPaths = [
    'admin',
    'login',
    'log-in',
    'signin',
    'sign-in',
    'dashboard',
    'phpmyadmin',
    'wp-admin',
    'wp-login.php',
    'setup.php',
    'index.php',
    '.env',
    'config.php',
    '.git',
    '.git/config',
    '.htaccess',
    'server-status',
    'webdav',
    'shell',
    'reset',
    'db',
    'database',
    'sql',
    'adminer',
    'api/v1/auth',
    'api/v1/login',
  ];

  use(req: any, res: any, next: () => void): void {
    res.on('finish', () => {
      const status = res.statusCode;
      if (status === 404) {
        const path = req.originalUrl?.split('?')[0]?.replace(/^\/+/, '');
        const ua = req.headers?.['user-agent'] ?? 'unknown';

        if (this.honeypotPaths.includes(path)) {
          console.warn(`[HONEYPOT] 🚨 Honeypot triggered at "${path}" — IP: ${req.ip} — UA: ${ua}`);
        }
      }
    });

    next();
  }
}
