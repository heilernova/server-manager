import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IConfig, IConfigLocal, IProject, ISession } from './config/config.interfaces.js';


export class Config {
    private readonly _rootDir: string;
    private readonly _config: IConfig;
    private readonly _configLocal: IConfigLocal;
    public readonly version: string;
    


    constructor(version: string, dir: string, config: IConfig, configLocal: IConfigLocal){
        this.version = version;
        this._rootDir = dir;
        this._config = config;
        this._configLocal = configLocal;
    }

    get projects(): IProject[] {
        return this._configLocal.projects;
    }

    get sessions(): ISession[] {
        return this._config.sessions;
    }

    get cache(){
        return this._config.cache;
    }

    addSession(session: ISession): void {
        session.url = session.url.replace(/\/$/, '');
        let index: number = this._config.sessions.findIndex(x => x.url == session.url);
        if (index > -1){
            this._config.sessions[index] = session;
        } else {
            this._config.sessions.push(session);
        }
        this.save();
    }

    addProject(project: IProject): void {
        this._configLocal.projects.push(project);
        this.save();
    }

    save(): void {
        let pathConfig: string = join(this._rootDir, 'config.json');
        let pathConfigLocal: string = 'nv-deploy.json'
        writeFileSync(pathConfig, JSON.stringify(this._config, undefined, 4));
        writeFileSync(pathConfigLocal, JSON.stringify(this._configLocal, undefined, 4));
    }
}