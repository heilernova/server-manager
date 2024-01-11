import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  private readonly _http: HttpClient
  constructor(http: HttpBackend) { 
    this._http = new HttpClient(http);
  }

  signIn(url: string, credentials: {  username: string, password: string }){
    return this._http.post<IAuthResponse>(`${url}/sign-in`, { hostname: 'web-panel', ...credentials});
  }
}

export interface IAuthResponse {
  role: "admin" | "developer";
  name: string;
  lastName: string;
  authorization: {
    type: "jwt" | "key";
    name: string;
    value: string;
  }
}
