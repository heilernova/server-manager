import { DbUsersService, IUser } from '@api/common/database';
import { GetSession, IsLoggedInGuard } from '@api/common/session';
import { Body, Controller, Get, HttpCode, HttpException, Patch, UseGuards } from '@nestjs/common';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseGuards(IsLoggedInGuard)
@Controller('profile')
export class ProfileController {

    constructor(private readonly _dbUsers: DbUsersService){}

    @Get()
    async get(@GetSession() session: IUser){
        return {
            role: session.role,
            name: session.name,
            lastName: session.lastName,
            username: session.username,
            email: session.email,
            cellphone: session.cellphone
        }
    }

    @Patch()
    @HttpCode(204)
    async update(@GetSession() session: IUser, @Body() body: ProfileUpdateDto){
        await this._dbUsers.update(session.id, body);
    }

    @Patch('password')
    @HttpCode(204)
    async password(@GetSession() session: IUser, @Body() body: UpdatePasswordDto){
        const passwordValid: boolean = await this._dbUsers.passwordValid(session.id, body.currentPassword);
        if (!passwordValid) throw new HttpException("Tu contraseña es incorrecta", 400);
        await this._dbUsers.update(session.id, { password: body.newPassword });
    }
}
