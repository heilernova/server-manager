import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiPm2Service {

  constructor(private readonly _http: HttpClient) { }

  getAllProcess(){
    return this._http.get<IPM2Process[]>('pm2/process');
  }
}


export interface IPM2Process {
  id: string;
  domain: string;
  name: string;
  url: string | null;
  port: string;
  status: string;
}