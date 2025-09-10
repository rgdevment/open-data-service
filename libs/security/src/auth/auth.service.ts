import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: any): string {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}
