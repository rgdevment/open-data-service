import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService, Public, Roles } from '@libs/security';
import { Role } from '@libs/common';

@Controller('v1')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get()
  getPublicStatus(): string {
    return 'This endpoint is public. Welcome to Neighborly!';
  }

  @Public()
  @Post('login')
  login(@Body() body: { rut: string; id: number; roles: Role[] }): { access_token: string } {
    return this.authService.login(body);
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
