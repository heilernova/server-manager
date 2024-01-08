import { uuid } from "./types";

export interface IToken {
    id: uuid;
    createAt: Date;
    userId: uuid;
    hostname: string;
    enable: boolean;
}

export interface ITOkenCreate {
    userId: uuid;
    hostname: string;
}

export interface ITokenUpdate {
    enable: boolean;
}