import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule as SecurityAuthModule } from '@libs/security';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { MailingModule } from '@libs/mailing';
import { RedisCacheModule } from '@libs/cache';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UsersModule, PassportModule, SecurityAuthModule, MailingModule, RedisCacheModule],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthenticationService],
})
export class AuthModule {}
