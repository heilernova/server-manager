import { AppService } from '@api/app.service';
import { DbApplicationsService, IUser } from '@api/common/database';
import { Pm2Service } from '@api/common/pm2';
import { GetSession, IsLoggedInGuard } from '@api/common/session';
import { Controller, Get, UseGuards } from '@nestjs/common';

@UseGuards(IsLoggedInGuard)
@Controller('pm2')
export class Pm2Controller {

    constructor(
        private readonly _pm2: Pm2Service,
        private readonly _apps: DbApplicationsService
    ){}

    @Get('process')
    async getAllProcess(@GetSession() session: IUser){
        let apps =  await this._apps.getAll(session.id);
        return this._pm2.getAll().map(x => {
            let app = apps.find(y => y.id == x.name);
            return {
                id: x.name,
                domain: app?.domain ?? '',
                name: app?.name ?? '',
                url: app?.url ?? null,
                port: x.pm2_env.PORT,
                status: x.pm2_env.status
            }
        });
    }
}
