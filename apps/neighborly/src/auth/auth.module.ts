import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule as SecurityAuthModule } from '@libs/security';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule, SecurityAuthModule],
  controllers: [AuthController],
  providers: [LocalStrategy],
})
export class AuthModule {}
