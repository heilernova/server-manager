import { Dirent, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';

import * as extract from 'extract-zip';

import { execSync } from 'node:child_process';

import { Pm2Service } from '@api/common/pm2';
import { DbApplicationsService, IAppRow, IApplication, uuid } from '@api/common/database';

@Injectable()
export class DeployService {
    constructor(private readonly _pm2: Pm2Service, private readonly _dbApps: DbApplicationsService){}

    async run(app: IApplication, zip: Buffer){
        switch(app.framework){
            case 'Angular': return this.runForAngular(app, zip);
            case 'NestJS': return null;
            case 'FastAPI': return null;
            case null: return null;
            default: return null;
        }
    }

    private async clearDir(location: string, ignore: string[]){
        let list: Dirent[] = readdirSync(`${location}`, { withFileTypes: true });
        let fileToDelete: Dirent[]  = list.filter(x => !ignore.some(y => y = x.name));
        return Promise.all(fileToDelete.map(async x => {
            rmSync(join(x.path, x.name), { force: true, recursive: true })
            return x.name;
        }))
    }

    private async extractFiles(appId: uuid, location: string, buffer: Buffer){
        let name: string = `zi-temp-${appId}.zip`;
        writeFileSync(name, buffer);
        await extract(name, { dir: location });
        rmSync(name);
    }

    private async runForAngular(app: IApplication,  buffer: Buffer){
        let location: string = app.location;
        await this.clearDir(location, app.ignore);
        await this.extractFiles(app.id, location, buffer);
        if (app.runtimeEnvironment == 'Node.js' && app.startupFile){
            // Utilizaremos PM2 para levantar el servidor
            this._pm2.start(location, app.startupFile, app.id, app.env);
        }
        return true;
    }

    private async runForNode(app: IAppRow, zip: Buffer){
        let locationApp: string = join(app.location, 'app');
        let currentPackage: { [p: string]: any } | undefined;
        let executeNPMInstall: boolean = false;
        if (existsSync(join(locationApp, 'package.json'))){
            currentPackage = JSON.parse(readFileSync(join(locationApp, 'package.json')).toString());
        }
        this.clearDir(locationApp, app.ignore);
        this.extractFiles(app.id, locationApp, zip);
        if (!existsSync(join(locationApp, 'node_modules'))){
            execSync('npm i --omit=dev', { cwd: locationApp });
        }

        if (app.runningOn == 'PM2' && app.startupFile){
            let nameProcess: uuid = app.id;
            let process = this._pm2.getAll().find(x => x.name == nameProcess);
            if (process){
                this._pm2.reload(nameProcess, app.env);
            } else {
                this._pm2.start(locationApp, app.startupFile, nameProcess, app.env);
            }
            process = this._pm2.getAll().find(x => x.name == nameProcess);
            if (process){
                this._dbApps.update(app.id, { version: process?.pm2_env.version });
                app.version = process.pm2_env.version;
            }
            // Guardamos
            if (!existsSync(join(app.location, 'backups'))){
                mkdirSync(join(app.location, 'backups'));
            }
            writeFileSync(join(app.location, 'backups', `V${process?.pm2_env.version}.zip`), zip);
            return process;
        }

        
    }

    async angular(app: IAppRow){
        if (app.runningOn == 'PM2' && app.startupFile){
            let nameProcess: uuid =  app.id;
            let process = this._pm2.getAll().find(x => x.name == nameProcess);
            if (process){
                this._pm2.reload(nameProcess, app.env);
            } else {
                this._pm2.start(app.location, app.startupFile, nameProcess, app.env);
            }
        }
    }

    async nestJS(app: IAppRow, packageJSON: any){
        // Verificamos que node_modules este instalado
        if (!existsSync(join(app.location, 'node_modules'))){
            execSync('npm i --omit=dev', { cwd: app.location });
        }

        if (app.runtimeEnvironment == 'Node.js' && app.runningOn == 'PM2' && app.startupFile){
            let name: uuid = app.id;
            let process = this._pm2.getAll().find(x => x.name == name);
            if (process){
                this._pm2.reload(name, app.env);
            } else {
                this._pm2.start(app.location, app.startupFile, name, app.env);
            }
        }
    }
}
