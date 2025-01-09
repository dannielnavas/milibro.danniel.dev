/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Token } from 'src/auth/models/token.model';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UsersService,
    private readonly jwtServices: JwtService,
  ) {}
  // `https://www.googleapis.com/books/v1/volumes?q=isbn:9789585454088&langRestrict=es&key=AIzaSyDHR8aj4rdfu6MIlUGV3JpdvxEFxPf60Ok`;

  async validateUser(email: string, password: string) {
    const user = await this.usersServices.findOneByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  generateJWT(user: User) {
    if (user.email === undefined)
      throw new UnauthorizedException(`Credenciales invalidas`);
    const payload: Token = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtServices.sign(payload),
      user,
    };
  }
}
