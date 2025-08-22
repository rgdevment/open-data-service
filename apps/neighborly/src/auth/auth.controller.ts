import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService, LocalAuthGuard, Public } from '@libs/security';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any): { access_token: string } {
    return this.authService.login(req.user);
  }
}
