import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcurrencyService {
  private readonly ipCounts = new Map<string, number>();
  private readonly maxConcurrent = 3;

  enter(ip: string): boolean {
    const current = this.ipCounts.get(ip) ?? 0;
    if (current >= this.maxConcurrent) return false;

    this.ipCounts.set(ip, current + 1);
    return true;
  }

  exit(ip: string): void {
    const current = this.ipCounts.get(ip);
    if (current !== undefined) {
      const next = Math.max(current - 1, 0);
      this.ipCounts.set(ip, next);
    }
  }
}
