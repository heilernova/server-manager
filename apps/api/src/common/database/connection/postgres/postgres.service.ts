import { Injectable } from '@nestjs/common';
import { Postgres } from './postgres';

@Injectable()
export class PostgresService extends Postgres {
    constructor(){
        super();
    }
}
