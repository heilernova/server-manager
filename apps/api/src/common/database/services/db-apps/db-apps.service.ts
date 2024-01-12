import { Injectable } from '@nestjs/common';
import { DbConnection, uuid, AppColumns, IAppRow, IAppInsert, IAppUpdate, IApplication } from '@api/common/database';

@Injectable()
export class DbApplicationsService {
    private readonly fields: string = AppColumns();
    private readonly sql: string = 'select a.* from apps a inner join apps_users b on b.app_id = a.id where b.user_id = $1';
    constructor(private readonly _db: DbConnection){}

    private parseInfo(application: IApplication){

    }

    async getAll(filter?: { userId?: uuid }): Promise<any[]> {
        return (await this._db.query(`select * from vi_applications`)).rows;
    }

    async get(appId: uuid, userId?: uuid): Promise<any | undefined> {

    }

    async create(data: IAppInsert){
        let result = await this._db.insert('applications', data, 'id');
        return result.rows[0]
    }

    async update(id: uuid, update: IAppUpdate): Promise<void> {
        await this._db.update('apps', ['id = $1', [id]], update);
    }

    async checkDomainAndName(domain: string, name: string, version: string | null = null): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from applications where domain = $1 and name = $2 and version = $3', [domain, name, version], true)).rows[0][0];
    }
    
    async checkLocation(location: string): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from applications where location = $1', [location], true)).rows[0][0];
    }
}
