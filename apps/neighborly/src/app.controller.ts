import { Controller, Get } from '@nestjs/common';
import { Public } from '@libs/security';

@Controller('v1')
export class AppController {
  @Public()
  @Get()
  getPublicStatus(): string {
    return 'This endpoint is public. Welcome to Neighborly!';
  }
}
