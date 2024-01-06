import { inject } from "../core.js";

export class CliCache {
    private readonly _config = inject.config();
    constructor(){
        
    }
    get login(){
        return this._config.cache.login;
    }

    setLogin(value: { server: string, username: string }){
        this._config.cache.login = value;
        this._config.save();
    }
}