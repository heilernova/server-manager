import axios from "axios";
import { AxiosResponse } from "axios";
import { stopSpinner } from "./spinner.js";
import { IServer } from "../config/config.interfaces.js";

export type Authentication = { type: 'JWT', value: string } | { type: 'key', name: string, value: string };
type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';
type Body = { [key:string]: any } | FormData;

export class HttpClient {
    private readonly _authentication?: Authentication;
    private readonly _server?: IServer;

    constructor(server?: IServer){
        if (server) this._server = server;
    }

    private send<R = any>(url: string, method: Method, body?: Body, headers?: { [key: string]: string }){
        return new Promise<AxiosResponse<R, any>>((resolve, reject) => {

            let headers: { [key: string]: string } | undefined;

            if (this._server){
                url = `${this._server.url}/${url}`;
                headers = {};
                if (this._server.authorization.type == 'JWT'){
                    headers['authorization'] = `Bearer ${this._server.authorization.value}`;
                } else {
                    headers[this._server.authorization.name] = this._server.authorization.value;
                }
            }
            axios({ url, method, data: body, headers })
            .then(res => resolve(res))
            .catch(err => {
                if (err.response){
                    reject(err.response);
                } else if (err.request){
                    stopSpinner(`There was no response from the server ${method} ${url}`, '✘');
                    process.exit();
                } else {
                    stopSpinner('Error preparing HTTP request', '✘');
                    process.exit(1);
                }
            });
        })
    }

    // authentication(auth: Authentication): HttpClient {
    //     // return new HttpClient(auth);
    // }

    server(server: IServer){
        return new HttpClient(server);
    }

    post<R = any>(url: string, body: Body){
        return this.send<R>(url, 'POST', body);
    }
    get(url: string){
        return this.send(url, 'GET');
    }
}

export class HttpError {
    constructor(){

    }
}

export interface Response extends AxiosResponse {}