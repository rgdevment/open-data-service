import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { Roles } from '@libs/security';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangeEmailDto } from '../authentication/dtos/change-email-request.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Role } from '@libs/common';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: any): Promise<UserEntity | null> {
    const userId = req.user.id;
    return await this.usersService.findOneByIdWithProfile(userId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin')
  getAdminPanel(@Request() req: any): any {
    return {
      message: 'Welcome to the Admin Panel!',
      adminUser: req.user,
    };
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
