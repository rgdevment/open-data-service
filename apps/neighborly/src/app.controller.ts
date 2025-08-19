import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService, LocalAuthGuard, Public, Roles } from '@libs/security';
import { CreateUserDto, User, UsersService } from '@libs/users';
import { Role } from '@libs/common';

@Controller('v1')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Get()
  getPublicStatus(): string {
    return 'This endpoint is public. Welcome to Neighborly!';
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() body: { rut: string; id: number; roles: Role[] }): { access_token: string } {
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
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
