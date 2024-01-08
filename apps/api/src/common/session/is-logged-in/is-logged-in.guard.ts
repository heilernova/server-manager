import { DbUsersService, IUser, uuid } from '@api/common/database';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class IsLoggedInGuard implements CanActivate {

  constructor(private readonly _users: DbUsersService){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    let token: string | undefined = context.switchToHttp().getRequest<Request>().headers['app-token'];
    if (!isUUID(token)) throw new HttpException('Se requiere autenticación', 401);
    let user: IUser | undefined  = await this._users.getForToken(token as uuid);
    if (!user) throw new HttpException('Token invalido', 401);
    context.switchToHttp().getRequest<any>().session = user;
    return true;
  }
}
