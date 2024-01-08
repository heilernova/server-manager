import { Injectable } from '@nestjs/common';
import { DbConnection, uuid, AppColumns, IAppRow, IAppInsert, IAppUpdate } from '@api/common/database';

@Injectable()
export class DbAppsService {
    private readonly fields: string = AppColumns();
    private readonly sql: string = 'select a.* from apps a inner join apps_users b on b.app_id = a.id where b.user_id = $1';
    constructor(private readonly _db: DbConnection){}

    async getAll(filter?: { userId?: uuid }): Promise<any[]> {
        if (filter?.userId){

        }
        return (await this._db.query(`select ${this.fields} from apps`)).rows;
    }

    async get(appId: uuid, userId?: uuid): Promise<IAppRow | undefined> {
        let sql: string;
        let params = [appId];
        if (userId){
            sql = `select ${AppColumns('a')} from apps a inner join apps_users b on b.app_id = a.id where a.id = $1 and b.user_id = $2`;
            params.push(userId);
        } else {
            sql = `select ${AppColumns()} from apps where id = $1`;
        }
        let result = await this._db.query(sql, params);
        return result.rows[0] ?? undefined;
    }

    async create(data: IAppInsert){
        let result = await this._db.insert('apps', data, this.fields);
        return result.rows[0]
    }

    async update(id: uuid, update: IAppUpdate): Promise<void> {
        await this._db.update('apps', ['id = $1', [id]], update);
    }

    async checkDomainAndName(domain: string, name: string, version: string | null = null): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from apps where domain = $1 and name = $2 and version = $3', [domain, name, version], true)).rows[0][0];
    }
    
    async checkLocation(location: string): Promise<boolean> {
        return (await this._db.query<[boolean]>('select count(*) = 0 from apps where location = $1', [location], true)).rows[0][0];
    }
}
