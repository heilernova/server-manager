import { OmitBy, PartialBy } from "@api/types";
import { Framework, RunningOn, RuntimeEnvironment, uuid } from "./types";

export const app_columns: string[] = [
    't.id',
    't.create_at as "createAt"',
    't.update_at as "updateAt"',
    't.last_deploy_at as "lastDeployAt"',
    't.version',
    't.domain',
    't.name',
    't.url',
    "case when t.github is not null then json_build_object('url', t.github, 'ssh', t.github_ssh_key, 'directory', t.github_directory) else null end as github",
    't.running_on as "runningOn"',
    't.startup_file as "startupFile"',
    't.framework',
    't.runtime_environment as "runtimeEnvironment"',
    't.env',
    't.location',
    't.ignore',
    't.observation'
];

export const AppColumns = (prefix?: string) => {
    if (prefix){
        let list = app_columns.map(x => x.replaceAll("t.", prefix ? `${prefix}.` : ""))
        return `${prefix}.${list.join(", ")}`;
    }
    return app_columns.join(', ');
}

export interface IAppRow {
    id: uuid;
    createAt: Date;
    updateAt: Date;
    lastDeployAt: Date;
    domain: string;
    name: string; 
    version: string | null;
    location: string;
    startupFile: string | null;
    url: string | null;
    framework: Framework | null;
    runningOn: RunningOn | null;
    runtimeEnvironment: RuntimeEnvironment | null;
    github: {
        url: string;
        location: string | null;
        ssh: string | null;
    } | null;
    env: { [key: string]: string };
    ignore: string[];
    observation: string | null;
}

export interface IAppInsert extends OmitBy<PartialBy<IAppRow, 'id' | 'version' | 'startupFile' | 'runningOn' | 'framework' | 'runningOn' | 'runtimeEnvironment' | 'github' | 'env' | 'ignore' | 'observation'>, 'createAt' | 'updateAt' | 'lastDeployAt'> {}

export interface IAppUpdate extends Partial<IAppInsert> {}

export interface IApplicationView extends IAppRow {
    permits: {
        role: "admin" | "collaborator";
        edit: boolean;
        deploy: boolean;
    }
}

export interface IApplication extends IApplicationView {
    status: "online" | "stopping" | "stopped" | "launching" | "errored" | "one-launch-status";
}