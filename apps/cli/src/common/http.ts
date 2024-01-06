import axios from "axios";
import { AxiosResponse } from "axios";
import { stopSpinner } from "./spinner.js";

export type Authentication = { type: 'JWT', value: string } | { type: 'key', name: string, value: string };
type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';
type Body = { [key:string]: any } | FormData;

export class HttpClient {
    private readonly _authentication?: Authentication;

    constructor(authentication?: Authentication){
        this._authentication = authentication;
    }

    private send(url: string, method: Method, body?: Body, headers?: { [key: string]: string }){
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {

            let headers: { [key: string]: string } | undefined;

            if (this._authentication){
                headers = {};
                if (this._authentication.type == 'JWT'){
                    headers['authorization'] = `Bearer ${this._authentication.value}`;
                } else {
                    headers[this._authentication.name] = this._authentication.value;
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

    authentication(auth: Authentication): HttpClient {
        return new HttpClient(auth);
    }

    post(url: string, body: Body){
        return this.send(url, 'POST', body);
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