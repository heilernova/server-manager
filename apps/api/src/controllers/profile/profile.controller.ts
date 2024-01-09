import { DbUsersService, IUser } from '@api/common/database';
import { GetSession, IsLoggedInGuard } from '@api/common/session';
import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfileUpdateDto } from './dto/profile-update.dto';

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
    async update(@GetSession() session: IUser, body: ProfileUpdateDto){
        await this._dbUsers.update(session.id, body);
    }
}
