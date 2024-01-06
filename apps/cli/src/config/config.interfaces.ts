import { Authentication } from "../common/http.js";

export interface ISession {
    url: string,
    username: string,
    authentication: Authentication;
}

export interface IConfig {
    sessions: ISession[];
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