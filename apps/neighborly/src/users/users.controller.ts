import { Controller, Post, Body, Patch, Request, HttpCode, Delete, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../authentication/dtos/register.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from '@libs/security';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangeEmailDto } from '../authentication/dtos/change-email-request.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ValidateEmailDto } from '../authentication/dtos/validate.email.dto';
import { ValidateDocumentDto } from '../authentication/dtos/validate.document.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  create(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.usersService.create(registerDto);
  }

  @Public()
  @Post('validate/mail')
  @HttpCode(200)
  async validateEmail(@Body() validateEmailDto: ValidateEmailDto): Promise<void> {
    await this.usersService.validateEmail(validateEmailDto);
  }

  @Public()
  @Post('validate/document')
  @HttpCode(200)
  async validateDocument(@Body() validateDocumentDto: ValidateDocumentDto): Promise<void> {
    await this.usersService.validateDocument(validateDocumentDto);
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto): Promise<UserEntity> {
    const userId: string = req.user.id;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch('me/email')
  async changeEmail(@Request() req: any, @Body() changeEmailDto: ChangeEmailDto): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.usersService.changeEmail(userId, changeEmailDto);
    return { message: 'Email changed successfully. Please log in again.' };
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.usersService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully.' };
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDeleteUser(@Request() req: any): Promise<void> {
    const userId = req.user.id;
    await this.usersService.softDeleteUser(userId);
  }
}
