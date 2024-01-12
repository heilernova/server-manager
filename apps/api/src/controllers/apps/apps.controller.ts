import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AppCreateDto, AppUpdateDto, DbApplicationsService, DbConnection, IAppRow, IUser, runtime_environment_list, uuid } from '@api/common/database';
import { IsUUIDPipe } from '@api/common/pipes';
import { GetSession, IsLoggedInGuard } from '@api/common/session';

@UseGuards(IsLoggedInGuard)
@Controller('apps')
export class AppsController {
    constructor(private readonly _dbApps: DbApplicationsService, private readonly _db: DbConnection){}

    @Post()
    async create(@GetSession() user: IUser, @Body() body: AppCreateDto){
        let check: boolean = await this._dbApps.checkDomainAndName(body.domain, body.name, body.version);
        if (!check){
            throw new HttpException(`Ya existe una aplicación el dominio y nombre [${body.domain}] - [${body.name}] - [${body.version}]`, 400);
        }
        if (!await this._dbApps.checkLocation(body.location)){
            throw new HttpException(`Ya existe una aplicación con la ubicación [${body.location}]`, 400);
        }
        let app = await this._dbApps.create(body as any);
        await this._db.insert('applications_access', { userId: user.id, appId: app.id, role: 'admin', deploy: true, edit: true });
        // return app;
    }

    @Get()
    async getAll(@GetSession() user: IUser){
        return (await this._dbApps.getAll({ userId: user.role == 'developer' ? user.id : undefined }));
    }

    @Get(':id')
    async get(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser){
        let app: IAppRow | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        return app;
    }
    
    @Put(':id')
    async update(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser, body: AppUpdateDto){
        let app: IAppRow | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        await this._dbApps.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser){
        let app: IAppRow | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        await this._db.delete('apps', ['id = $1', [id]]);
    }
}
