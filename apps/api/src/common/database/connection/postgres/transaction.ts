import { PoolClient, QueryResult, QueryResultRow } from "pg";
import { sqlDelete, sqlInsert, sqlUpdate } from "./sql-formatter";

export class Transaction {
    constructor(
        private readonly _connection: PoolClient
    ){}

    async commit(){
        try {
            await this._connection.query('COMMIT');
        } catch (error) {
            this._connection.query('ROLLBACK');
            throw error;
        }
    }

    async query<T extends QueryResultRow = any>(sql: string, params?: any[], arrayMode?: false): Promise<QueryResult<T>>;
    async query<T extends any[] = any[]>(sql: string, params?: any[], arrayMode?: true): Promise<QueryResult<T>>;
    async query(): Promise<any> {
        try {
            if (arguments[2]){
                return this._connection.query({ text: arguments[0], values: arguments[1], rowMode: 'array' });
            } else {
                return this._connection.query(arguments[0], arguments[1]);
            }
        } catch (error) {
            throw error;
        }
    }

    async insert<T extends QueryResultRow = any>(query: { table: string, values: { [colunm: string]: any } | { [colunm: string]: any }[], returning?: string | string[] }): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[]>(query: { table: string, values: { [colunm: string]: any } | { [colunm: string]: any }[], returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async insert<T extends QueryResultRow = any>(table: string, values: { [colunm: string]: any } | { [colunm: string]: any }[], returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[]>(table: string, values: { [colunm: string]: any } | { [colunm: string]: any }[], returning?: string | string[], arrayMode?: true): Promise<QueryResult<T>>;
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
    async update<T extends QueryResultRow = any>(table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async update<T extends any[] = any[]>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async update(){
        let arrayMode: boolean | undefined;
        let query: { sql: string, params?: any[] };

        if (typeof arguments[0] == 'string'){
            query = sqlUpdate({ table: arguments[0], condition: arguments[1], update: arguments[2], returning: arguments[3] });
            arrayMode = arguments[3];
        } else {
            query = sqlUpdate(arguments[0]);
            arrayMode = arguments[0].arrayMode;
        }

        if (arrayMode){
            return this.query(query.sql, query.params, true);
        } else {
            this.query(query.sql, query.params);
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