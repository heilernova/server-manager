import { Injectable } from '@nestjs/common';
import { DbConnection, uuid, AppColumns, IAppRow, IAppInsert, IAppUpdate, IApplication, IApplicationView } from '@api/common/database';
import { Pm2Process, Pm2Service } from '@api/common/pm2';

@Injectable()
export class DbApplicationsService {
    private readonly fields: string = AppColumns();
    private readonly sql: string = 'select a.* from apps a inner join apps_users b on b.app_id = a.id where b.user_id = $1';
    private readonly sqlSelectView: string = 'select id, create_at as "createAt", update_at as "updateAt", last_deploy_at as "lastDeployAt", domain, name, version, location, startup_file as "startupFile", framework, running_on as "runningOn", runtime_environment as "runtimeEnvironment", url, github, env, ignore, observation, permits from vi_applications';
    constructor(private readonly _db: DbConnection, private readonly _pm2: Pm2Service){}

    async getAll(userId: uuid): Promise<IApplication[]> {
        let list = (await this._db.query(`${this.sqlSelectView} where user_id = $1`, [userId])).rows;
        let pm2ProcessList: Pm2Process[] = this._pm2.getAll();
        return list.map(app => {
            let process: Pm2Process | undefined = pm2ProcessList.find(x => x.name == app.id);
            return {
                ...app,
                status: process ? process.pm2_env.status : "stopped"
            }
        })

    }

    async get(appId: uuid, userId: uuid): Promise<IApplication | undefined> {
        let result = await (this._db.query<IApplicationView>(`${this.sqlSelectView} where id = $1 and user_id = $2`, [appId, userId]));
        if (result.rows[0]){
            let process: Pm2Process | undefined = this._pm2.getAll().find(x => x.name == result.rows[0].id);
            return {
                ...result.rows[0],
                status: process ? process.pm2_env.status : 'stopped'
            }
        }
        return undefined;
    }

    async create(data: IAppInsert, userId: uuid): Promise<IApplication>{
        let result = (await this._db.insert<[uuid]>('applications', data, 'id', true)).rows[0][0];
        await this._db.insert('applications_access', { userId: userId, appId: result, deploy: true, edit: true });
        return await this.get(result, userId) as IApplication;
    }

    async delete(id: uuid): Promise<void> {
        await this._db.delete('applications', ['id = $1', [id]]);
    }

    async update(id: uuid, update: IAppUpdate): Promise<void> {
        await this._db.update('applications ', ['id = $1', [id]], update);
    }

    async checkDomainAndName(domain: string, name: string, version: string | null = null): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from applications where domain = $1 and name = $2 and version = $3', [domain, name, version], true)).rows[0][0];
    }
    
    async checkLocation(location: string): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from applications where location = $1', [location], true)).rows[0][0];
    }
}
