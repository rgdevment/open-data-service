import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: any): { access_token: string } {
    // database and validation
    const payload = { rut: user.rut, sub: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
