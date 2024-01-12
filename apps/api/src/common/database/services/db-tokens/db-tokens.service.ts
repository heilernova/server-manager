import { Injectable } from '@nestjs/common';
import { DbConnection, uuid } from '@api/common/database';

@Injectable()
export class DbTokensService {
    constructor(private readonly _db: DbConnection){}

    async generate(userId: uuid, hostname: string){
        await this._db.delete('users_tokens', ['user_id = $1 and hostname = $2', [userId, hostname]]);
        return (await this._db.insert('users_tokens', { userId, hostname }, '*')).rows[0];
    }
}
