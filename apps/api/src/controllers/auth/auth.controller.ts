import { Body, Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';
import { DbTokensService, DbUsersService, IUser, IUserAuth } from '@api/common/database';
import { CredentialsDto } from './dto/credentials.dto';
import { GetSession, IsLoggedInGuard } from '@api/common/session';

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
        let user = await this._dbUsers.get(auth.id);
        return {
            username: user?.username,
            name: user?.name,
            lastName: user?.lastName,
            role: user?.role,
            authorization: {
                type: 'key',
                name: 'app-token',
                value: token.id
            },
        };
    }

    @UseGuards(IsLoggedInGuard)
    @Get('verify-session')
    async verifySession(@GetSession() session: IUser){
        return {
            role: session.role,
            name: session.name,
            lastName: session.lastName
        }
    }
}
