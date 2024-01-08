import { UserLogAction, UserLogState, uuid } from "./types";

export interface IUserLog {
    id: uuid;
    createAt: Date;
    userId: uuid;
    action: UserLogAction;
    state: UserLogState;
    detail: string;
}