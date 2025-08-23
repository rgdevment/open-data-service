import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService, LocalAuthGuard, Public, RateLimitGuard } from '@libs/security';
import { RequestOtpDto } from './dtos/request-otp.dto';
import { AuthenticationService } from './authentication.service';

@Controller('v1/auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('otp/request')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    await this.authenticationService.requestOtp(requestOtpDto.email, requestOtpDto.purpose);
    return { message: 'If the email is valid, an OTP has been sent.' };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any): { access_token: string } {
    return this.authService.login(req.user);
  }
}
