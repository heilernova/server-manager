import { DatabaseError, Pool, QueryResult, QueryResultRow } from 'pg';
import { sqlDelete, sqlInsert, sqlUpdate } from './sql-formatter';
import { Transaction } from './transaction';

export class Postgres {
    private readonly _connection: Pool;

    constructor(options?: { host?: string, user?: string, password?: string, database?: string, port?: number}){
        this._connection = new Pool();
    }

    get connection(): Pool {
        return this._connection;
    }

    async trasaction(){
        const con = await this._connection.connect();
        await con.query('BEGIN');
        return new Transaction(con);
    }
    
    async query<T extends QueryResultRow = any>(sql: string, params?: any[], arrayMode?: false): Promise<QueryResult<T>>;
    async query<T extends any[] = any[]>(sql: string, params?: any[], arrayMode?: true): Promise<QueryResult<T>>;
    async query(): Promise<any> {
        try {
            
            if (arguments[2]){
                return await this._connection.query({ text: arguments[0], values: arguments[1], rowMode: 'array' });
            } else {
                return await this._connection.query(arguments[0], arguments[1]);
            }
        } catch (error) {
            if (error instanceof DatabaseError){
                (error as any).query = {
                    command: arguments[0],
                    params: arguments[1]
                }
            }

            
            throw error;
        }
    }

    async insert<T extends QueryResultRow = any, V = { [colunm: string]: any }>(query: { table: string, values: V | V[], returning?: string | string[] }): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[], V = { [colunm: string]: any }>(query: { table: string, values: V | V[], returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async insert<T extends QueryResultRow = any, V = { [colunm: string]: any }>(table: string, values: V | V[], returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[], V = { [colunm: string]: any }>(table: string, values: V |V[], returning?: string | string[], arrayMode?: true): Promise<QueryResult<T>>;
    async insert(){
        let arrayMode: boolean | undefined;
        let query: { sql: string, params?: any[] };

        if (typeof arguments[0] == 'string'){
            query = sqlInsert({ table: arguments[0], values: arguments[1], returning: arguments[2] })
            arrayMode = arguments[3];
        } else {
            query = sqlInsert(arguments[0]);
            arrayMode = arguments[0].arrayMode;
        }

        if (arrayMode){
            return this.query(query.sql, query.params, true);
        } else {
            return this.query(query.sql, query.params);
        }
    }

    async update<T extends QueryResultRow = any>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[] }): Promise<QueryResult<T>>;
    async update<T extends any[] = any[]>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async update<T extends QueryResultRow = any, V = { [column: string] : any }>(table: string, condition: [string, any[]] | string , update: V, returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async update<T extends any[] = any[]>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async update(){
        let arrayMode: boolean | undefined;
        let query: { sql: string, params?: any[] };

        if (typeof arguments[0] == 'string'){
            query = sqlUpdate({ table: arguments[0], condition: arguments[1], update: arguments[2], returning: arguments[3] });
            arrayMode = arguments[4];
        } else {
            query = sqlUpdate(arguments[0]);
            arrayMode = arguments[0].arrayMode;
        }

        if (arrayMode){
            return this.query(query.sql, query.params, true);
        } else {
            return this.query(query.sql, query.params);
        } 
    }

    async delete<T extends QueryResultRow = any>(query: { table: string, condition: string | [string, any[]], returning?: string | string[] }): Promise<QueryResult<T>>;
    async delete<T extends any[] = any[]>(query: { table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async delete<T extends QueryResultRow = any>(table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async delete<T extends any[] = any[]>(table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: true): Promise<QueryResult<T>>;
    async delete(){
        let arrayMode: boolean | undefined;
        let query: { sql: string, params?: any[] };

        if (typeof arguments[0] == 'string'){
            query = sqlDelete({ table: arguments[0], condition: arguments[1], returning: arguments[2]});
            arrayMode = arguments[3];
        } else {
            query = sqlDelete(arguments[0]);
            arrayMode = arguments[0].arrayMode;
        }

        if (arguments[0].arrayMode){
            return this.query(query.sql, query.params, true);
        } else {
            return this.query(query.sql, query.params);
        }
    }
}
