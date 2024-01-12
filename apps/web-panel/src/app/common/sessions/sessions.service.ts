import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _user: ISession | null = null;
  public readonly userChange = new BehaviorSubject<ISession | null>(null);

  constructor() { }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("sm", 3);
      request.onerror = err => reject(err);
      request.onupgradeneeded = () => {
        const object = request.result.createObjectStore("sessions", { keyPath: "id" });
      }
      request.onsuccess = () => {
        resolve(request.result);
      }
    })
  }

  private getAllSessions(): Promise<ISession[]> {
    return new Promise((resolve, reject) => {
      this.openIndexedDB()
      .then(db => {
        let objectStore = db.transaction("sessions", "readonly").objectStore("sessions");
        let result = objectStore.getAll();
        result.onerror = err => reject(err);
        result.onsuccess = () => {
          resolve(result.result);
          db.close();
        }
      })
      .catch(err => reject(err));
    });
  }

  get user(){
    return this._user;
  }
  set user(value: ISession | null){
    this._user = value;
    if (value){
      localStorage.setItem('session', value.id);
    } else {
      localStorage.removeItem('session');
    }
    this.userChange.next(value);
  }

  load(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getAllSessions().then(list => {
        if (list.length == 0){
          resolve(false);
        } else {
          let idSession: string | null = localStorage.getItem("session");
          let session = list.find(x => x.id == idSession);
          this.user = session ?? list[0];
          resolve(true);
        }
      })
      .catch(() => {
        resolve(false);
      })
    });
  }

  save(session: ISessionSave): Promise<ISession> {
    return new Promise((resolve, reject) => {
      this.openIndexedDB()
      .then(async db => {
        let objectStore = db.transaction("sessions", "readwrite").objectStore("sessions");
        let result = objectStore.getAll();
        result.onerror = err => reject(err);
        result.onsuccess = () => {
          let sessions: ISession[] = result.result;
          session.id = sessions.find(x => x.url == session.url)?.id ?? crypto.randomUUID();
          let result2 = objectStore.put(session);
          result2.onerror = err => reject(err);
          result2.onsuccess = () => {
            resolve(session as ISession);
          }
        }
      })
      .catch(err => reject(err));
    });
  }

  delete(id: string): Promise<void>{
    return new Promise((resolve, reject) => {
      this.openIndexedDB().then(db => {
        let objectStore = db.transaction("sessions", "readwrite").objectStore("sessions");
        let result = objectStore.delete(id);
        result.onerror = err => reject(err);
        result.onsuccess = () => {
          resolve();
        }
      })
      .catch(err => reject(err));
    })
  }
}


export interface ISessionSave {
  id?: string;
  role: "admin" | "developer";
  name: string;
  lastName: string;
  url: string;
  authorization: {
    type: "jwt" | "key";
    name: string;
    value: string
  }
}
export interface ISession {
  id: string;
  role: "admin" | "developer";
  name: string;
  lastName: string;
  url: string;
  authorization: {
    type: "jwt" | "key";
    name: string;
    value: string
  }
}