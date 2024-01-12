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
    version: string | null;
    domain: string;
    name: string; 
    url: string | null;
    github: string | null;
    githubSshKey: string | null;
    runningOn: RunningOn | null;
    startupFile: string | null;
    framework: Framework | null;
    runtimeEnvironment: RuntimeEnvironment | null;
    env: { [key: string]: string };
    location: string;
    ignore: string[];
    observations: string | null;
}

export interface IAppInsert {
    version?: string | null;
    domain: string;
    name: string;
    url: string | null;
    github: string | null;
    githubSshKey: string | null;
    runningOn: RunningOn | null;
    startupFile: string | null;
    framework: Framework | null;
    runtimeEnvironment: RuntimeEnvironment | null;
    env: { [key: string]: string };
    location: string;
    ignore: string[];
    observations: string | null;
}

export interface IAppUpdate extends Partial<IAppInsert> {}