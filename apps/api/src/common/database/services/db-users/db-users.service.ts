import { Injectable } from '@nestjs/common';

import { DbConnection, Role, uuid, UserColumnsView, IUser, IUserCreate, IUserUpdate, IUserAuth } from '@api/common/database';
import { filter } from 'rxjs';


@Injectable()
export class DbUsersService {
    private readonly fields: string = UserColumnsView;
    private readonly fieldsForToken: string = `a.${UserColumnsView.replaceAll(', ', ', a.')}`;
    constructor(private readonly _db: DbConnection){}

    async getAll(filter?: { ignore?: uuid | uuid[], lock?: boolean, role?: Role }): Promise<IUser[]> {
        let conditions: string[] = [];
        let condition: string = '';
        let params: any[] = [];
        if (filter?.ignore){
            conditions.push(`id <> any($${params.push(typeof filter.ignore == 'string' ? [filter.ignore] : filter.ignore)})`);
        }
        if (conditions.length > 0){
            condition = `where ${conditions.join(' and ')}`;
        }
        const result = await this._db.query<IUser>(`select ${this.fields} from users ${condition}`, params);
        return result.rows;
    }

    async get(id: uuid): Promise<IUser | undefined> {
        const result = await this._db.query<IUser>(`select ${this.fields} from users where id = $1`, [id]);
        return result.rows[0] ?? undefined;
    }

    async getForToken(token: uuid): Promise<IUser | undefined> {
        const result = await this._db.query<IUser>(`select ${this.fieldsForToken} from users a inner join users_tokens b on b.user_id = a.id where b.id = $1`, [token]);
        return result.rows[0] ?? undefined;
    }

    async create(data: IUserCreate): Promise<IUser> {
        const result = await this._db.insert<IUser>('users', data, this.fields);
        return result.rows[0];
    }

    async update(id: uuid, update: IUserUpdate): Promise<IUser> {
        const result = await this._db.update<IUser>('users', ['id = $1', [id]], update);
        return result.rows[0];
    }

    async delete(id: uuid): Promise<void> {
        await this._db.delete('users', ['id = $1', [id]]);
    }

    async auth(username: string, password: string): Promise<IUserAuth | undefined> {
        const result = await this._db.query<IUserAuth>('select id, name, last_name as "lastName", lock, password_valid as "passwordValid" from user_auth($1, $2)', [username, password]);
        return result.rows[0] ?? undefined;
    }

    async passwordValid(userId: string, password: string){
        return (await this._db.query<[boolean]>(`select user_password_valid($1, $2)`, [userId, password], true)).rows[0][0];
    }
}
