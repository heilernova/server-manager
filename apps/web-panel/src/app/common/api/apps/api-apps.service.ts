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
}
