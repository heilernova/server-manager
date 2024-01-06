import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { IConfig, IConfigLocal } from "./config.interfaces.js";


const defaultConfig = (): IConfig => {
    return {
        sessions: [],
        cache: {}
    }
}

export const loadConfig = (dir: string): IConfig => {
    const path: string = join(dir, 'config.json');
    if (existsSync(path)){
        return JSON.parse(readFileSync(path).toString())
    } else {
        let temp = defaultConfig();
        writeFileSync(path, JSON.stringify(temp, undefined, 4));
        return temp;
    }
}

export const loadConfigLocal = (): IConfigLocal => {
    const path: string = './nv-deploy.json';
    if (existsSync(path)){
        return JSON.parse(readFileSync(path).toString());
    } else {
        writeFileSync(path, JSON.stringify({ projects: [] }, undefined, 4));
        return { projects: [] };
    }
}

export const loadPackageJSON = (dir: string): any => {
    const path: string = join(dir, '../package.json');
    if (existsSync(path)){
        return JSON.parse(readFileSync(path).toString());
    } else {
        return {}
    }
}