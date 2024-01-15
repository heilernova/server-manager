import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AppCreateDto, AppUpdateDto, DbApplicationsService, DbConnection, IAppRow, IApplication, IUser, runtime_environment_list, uuid } from '@api/common/database';
import { IsUUIDPipe } from '@api/common/pipes';
import { GetSession, IsLoggedInGuard } from '@api/common/session';
import { Pm2Process, Pm2Service } from '@api/common/pm2';

@UseGuards(IsLoggedInGuard)
@Controller('apps')
export class AppsController {
    constructor(private readonly _dbApps: DbApplicationsService, private readonly _pm2: Pm2Service){}

    @Post()
    async create(@GetSession() user: IUser, @Body() body: AppCreateDto){
        let check: boolean = await this._dbApps.checkDomainAndName(body.domain, body.name, body.version);
        if (!check){
            throw new HttpException(`Ya existe una aplicación el dominio y nombre [${body.domain}] - [${body.name}] - [${body.version}]`, 400);
        }
        if (!await this._dbApps.checkLocation(body.location)){
            throw new HttpException(`Ya existe una aplicación con la ubicación [${body.location}]`, 400);
        }
        let app = await this._dbApps.create(body, user.id); return app;
       
    }

    @Get()
    async getAll(@GetSession() user: IUser){
        return (await this._dbApps.getAll(user.id));
    }

    @Get(':id')
    async get(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser){
        let app: IAppRow | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        return app;
    }
    
    @Patch(':id')
    async update(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser, @Body() body: AppUpdateDto){
        let app: IApplication | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        if (!app.permits.edit) throw new HttpException("No tienes permisos para actualizar la información", 403);
        await this._dbApps.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', IsUUIDPipe) id: uuid, @GetSession() user: IUser){
        let app: IApplication | undefined = await this._dbApps.get(id, user.id);
        if (app == undefined) throw new HttpException('App no encontrada', 404);
        if (user.role != 'admin') throw new HttpException('No tienes los permisos necesario para eliminar la aplicación', 403);
        await this._dbApps.delete(id);
        if (app.runningOn == 'PM2'){
            let process: Pm2Process | undefined =  this._pm2.getAll().find(x => x.name == id);
            if (process){
                this._pm2.delete(id);
            }
        }
    }
}
