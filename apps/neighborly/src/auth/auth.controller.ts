import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService, LocalAuthGuard, Public, RateLimitGuard } from '@libs/security';
import { RequestOtpDto } from './dtos/request-otp.dto';
import { AuthenticationService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('otp/request')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    await this.authenticationService.requestOtp(requestOtpDto.email);
    return { message: 'OTP sent successfully' };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any): { access_token: string } {
    return this.authService.login(req.user);
  }
}
