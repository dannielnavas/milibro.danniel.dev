import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import config from 'src/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('ApiKeyGuard');
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    console.log('request', request);
    const authHeader = request.header('api-key');
    console.log('authHeader', authHeader);
    const isAuth = authHeader === this.configService.apiKey;
    console.log('isAuth', isAuth);
    if (!isAuth) {
      throw new UnauthorizedException('Not authorized');
    }
    return isAuth;
  }
}
