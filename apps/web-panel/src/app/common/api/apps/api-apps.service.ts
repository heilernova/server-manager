import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application, IApplicationAPIResponse } from './app.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAppsService {

  constructor(private _http: HttpClient) { }

  getAll(){
    return this._http.get<IApplicationAPIResponse[]>("apps").pipe(map(res => res.map(x => new Application(x))));
  }

  get(id: string){
    return this._http.get<IApplicationAPIResponse>(`apps/${id}`).pipe(map(res => new Application(res)));
  }

  update(id: string, update: any){
    return this._http.patch<void>(`apps/${id}`, update);
  }

  create(data: IApplicationCreate){
    return this._http.post<IApplicationAPIResponse>('apps', data).pipe(map(res => new Application(res)));
  }

  delete(id: string){
    return this._http.delete<void>(`apps/${id}`);
  }
}

export interface IApplicationCreate {
  domain: string;
  name: string;
  location: string;
  startupFile: string | null;
  runtimeEnvironment: RuntimeEnvironment;
  framework: Framework;
  runningOn: RunningOn;
  ignore: string[];
  env: { [key: string]: string }
}


export type RuntimeEnvironment = "Node.js" | "Python" | "PHP" | null;
export type Framework = "Angular" | "NestJS" | "FastAPI" | null;
export type RunningOn = "PM2" | "Docker" | "LiteSpeed" | null;