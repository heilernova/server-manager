import { Injectable } from '@nestjs/common';

import { DbConnection, Role, uuid, UserColumnsView, IUser, IUserCreate, IUserUpdate, IUserAuth } from '@api/common/database';


@Injectable()
export class DbUsersService {
    private readonly fields: string = UserColumnsView;
    private readonly fieldsForToken: string = `a.${UserColumnsView.replaceAll(', ', ', a.')}`;
    constructor(private readonly _db: DbConnection){}

    async getAll(filer?: { ignore?: uuid | uuid[], lock?: boolean, role?: Role }): Promise<IUser[]> {
        let conditions: string[] = [];
        let condition: string = '';
        let params: any[] = [];
        if (filer?.ignore){
            conditions.push(`id in $${params.push(typeof filer.ignore == 'string' ? [filer.ignore] : filer.ignore)}`);
        }
        if (conditions.length > 0){
            condition = `where ${conditions.join(' and ')}`;
        }
        const result = await this._db.query<IUser>(`select ${this.fields} from users${condition}`);
        return result.rows;
    }

    async get(id: uuid): Promise<IUser | undefined> {
        const result = await this._db.query<IUser>(`select ${this.fields} from users where id = $1`, [id]);
        return result.rows[0] ?? undefined;
    }

    async getForToken(token: uuid): Promise<IUser | undefined> {
        const result = await this._db.query<IUser>(`select ${this.fieldsForToken} from users a inner join tokens b on b.user_id = a.id where b.id = $1`, [token]);
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
}
