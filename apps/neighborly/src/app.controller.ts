import { Controller, Get, Request } from '@nestjs/common';
import { Public, Roles, Role } from '@libs/security';

@Controller()
export class AppController {
  @Public()
  @Get()
  getPublicStatus(): string {
    return 'This endpoint is public. Welcome to Neighborly!';
  }

  @Get('profile')
  getProfile(@Request() req: any): any {
    return {
      message: 'This is a protected route for authenticated users.',
      user: req.user,
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin')
  getAdminPanel(@Request() req: any): any {
    return {
      message: 'Welcome to the Admin Panel!',
      adminUser: req.user,
    };
  }
}
