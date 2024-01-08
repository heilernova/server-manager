import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import { Postgres } from "./postgres/postgres";

@Injectable()
export class DbConnection extends Postgres {

    constructor(){
        super()
    }

    static checkConnection(connection: { host: string, user: string, password: string, database: string, port?: number }): Promise<void> {

        return new Promise((resolve, reject) => {
            let pool = new Pool(connection);
            pool.connect().then(() => {
                resolve();
            })
            .catch(err => {
                reject(err);
            })
        })
    }
}