import { Authentication } from "../common/http.js";

export interface IServer {
    url: string,
    username: string,
    authentication: Authentication;
}

export interface IConfig {
    servers: IServer[];
    cache: {
        login?: {
            server: string,
            username: string
        }
    }
}

export interface IConfigLocal {
    projects: IProject[]
}

export interface IProject {
    id: string,
    domina: string,
    name: string;
    url: string,
    deployIn: string;
    framework: string;
    location: string;
    include: string[];
}