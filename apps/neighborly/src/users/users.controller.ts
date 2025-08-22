import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dtos/register.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from '@libs/security';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  create(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.usersService.create(registerDto);
  }
}
