import { Controller, Post, Body, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dtos/register.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from '@libs/security';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  create(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.usersService.create(registerDto);
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto): Promise<UserEntity> {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }
}
