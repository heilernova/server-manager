import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiProfileService {

  constructor(private _http: HttpClient) { }

  getInfo(){
    return this._http.get<any>('profile');
  }

  update(data: any){
    return this._http.patch("profile", data);
  }

  updatePassword(data: { currentPassword: string, newPassword: string }){
    return this._http.patch<void>("profile/password", data);
  }
}
