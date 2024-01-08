import { Role, uuid } from "./types";

export interface IUserRow {
    id: uuid;
    createAt: Date;
    role: Role;
    lock: boolean;
    username: string;
    email: string;
    name: string;
    lastName: string;
    cellphone: string;
    password: string;
}

export const UserColumns: string = 'id, create_at as "createAt", role, lock, username, email, name, last_name as "lastName", cellphone, password';
export const UserColumnsView: string = 'id, create_at as "createAt", role, lock, username, email, name, last_name as "lastName", cellphone';

export interface IUser {
    id: uuid;
    createAt: Date;
    role: Role;
    lock: boolean;
    username: string;
    email: string;
    name: string;
    lastName: string;
    cellphone: string;
}

export interface IUserCreate {
    id?: uuid;
    lock: boolean;
    username: string;
    email: string;
    name: string;
    lastName: string;
    cellphone: string;
    password: string;
}

export interface IUserUpdate extends Partial<IUserCreate> {}

export interface IUserAuth {
    id: uuid;
    lock: boolean;
    passwordValid: boolean;
}