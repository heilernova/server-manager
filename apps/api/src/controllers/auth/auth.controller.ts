import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { DbTokensService, DbUsersService, IUserAuth } from '@api/common/database';
import { CredentialsDto } from './dto/credentials.dto';

@Controller()
export class AuthController {
    constructor(private readonly _dbUsers: DbUsersService, private readonly _dbTokens: DbTokensService){}
    @Post('sign-in')
    async signIn(@Body() credentials: CredentialsDto){
        let auth: IUserAuth | undefined = await this._dbUsers.auth(credentials.username, credentials.password);
        if (!auth) throw new HttpException('Usuario incorrecto', 400);
        if (auth.lock) throw new HttpException('Tú usuario ya no tiene acceso', 400);
        if (!auth.passwordValid) throw new HttpException('Tú contraseña es incorrecta', 400);
        let token = await this._dbTokens.generate(auth.id, credentials.hostname);
        return {
            type: 'key',
            name: 'app-token',
            value: token.id
        };
    }
}
