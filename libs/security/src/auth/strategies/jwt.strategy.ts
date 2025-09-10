import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Role } from '@libs/common';

interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}

interface AuthenticatedUser {
  id: string;
  email: string;
  roles: Role[];
}

const cookieExtractor = (req: Request): string | null => {
  console.log('--- Ejecutando Cookie Extractor ---');
  console.log('Cookies recibidas en la estrategia:', req.cookies);

  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
