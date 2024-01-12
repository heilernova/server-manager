import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISession } from '@app/common/sessions';

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

  verifySession(session: ISession){
    let headers = new HttpHeaders();
    headers = headers.append(session.authorization.name, session.authorization.value);
    return this._http.get<{ role:"admin" | "developer", name: string, lastName: string }>(`${session.url}/verify-session`,  { headers });
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
