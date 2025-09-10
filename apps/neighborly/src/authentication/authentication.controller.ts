import { Controller, Post, UseGuards, Request, Body, Res, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { AuthService, LocalAuthGuard, Public, RateLimitGuard } from '@libs/security';
import { RequestOtpDto } from './dtos/request-otp.dto';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ValidateUserDto } from './dtos/validate.user.dto';

@Controller('v1/auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @HttpCode(200)
  @Post('otp/request')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    await this.authenticationService.requestOtp(requestOtpDto.email, requestOtpDto.purpose);
    return { message: 'If the email is valid, an OTP has been sent.' };
  }

  @Public()
  @Post('register')
  create(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authenticationService.create(registerDto);
  }

  @Public()
  @Post('validate')
  @HttpCode(200)
  async validateUser(@Body() validateUserDto: ValidateUserDto): Promise<void> {
    await this.authenticationService.validateUserByEmailOrDocument(validateUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Request() req: any, @Res({ passthrough: true }) response: Response): any {
    const accessToken = this.authService.login(req.user);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return req.user;
  }
}
