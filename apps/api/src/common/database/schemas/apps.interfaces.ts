import { Framework, RunningOn, RuntimeEnvironment, uuid } from "./types";

export const app_columns: string[] = [
    'id',
    'create_at as "createAt"',
    'update_at as "updateAt"',
    'last_deploy_at as "lastDeployAt"',
    'version',
    'domain',
    'name',
    'url',
    'github',
    'github_ssh_key as "githubSshKey"',
    'running_on as "runningOn"',
    'startup_file as "startupFile"',
    'framework',
    'runtime_environment as "runtimeEnvironment"',
    'env',
    'location',
    'ignore',
    'observation'
];

export const AppColumns = (prefix?: string) => {
    if (prefix){
        return `${prefix}.${app_columns.join(`, ${prefix}.`)}`;
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