export class Application {
    id!: string;
    createAt!: Date;
    updateAt!: Date;
    lastDeployAt!: Date | null;
    domain!: string;
    name!: string;
    version!: string | null;
    location!: string;
    startupFile!: string | null;
    framework!: string;
    runningOn!: string;
    runtimeEnvironment!: string;
    url!: string | null;
    github!: {
        url: string;
        ssh: string | null;
        directory: string | null
    };
    env!: { [key: string]: string };
    ignore!: string[];
    observation!: string | null;
    status!: "online" | "stopped"  | "errored";

    constructor(data: IApplicationAPIResponse){
        this.id = data.id;
        this.createAt = new Date(data.createAt);
        this.updateAt = new Date(data.updateAt);
        this.lastDeployAt = data.lastDeployAt ? new Date(data.lastDeployAt) : null;
        this.domain = data.domain;
        this.name = data.name;
        this.version = data.version;
        this.location = data.location;
        this.startupFile = data.startupFile;
        this.framework = data.framework;
        this.runningOn = data.runningOn;
        this.runtimeEnvironment = data.runtimeEnvironment;
        this.url = data.url;
        this.github = data.github;
        this.env = data.env;
        this.ignore = data.ignore;
        this.observation = data.observation;
        this.status = data.status;
    }
}

export interface IApplicationAPIResponse {
    id: string;
    createAt: string;
    updateAt: string;
    lastDeployAt: string | null;
    domain: string;
    name: string;
    version: string | null;
    location: string;
    startupFile: string | null;
    framework: string;
    runningOn: string;
    runtimeEnvironment: string;
    url: string | null;
    github: {
        url: string;
        ssh: string | null;
        directory: string | null
    };
    env: { [key: string]: string };
    ignore: string[];
    observation: string | null;
    status: "online" | "stopped"  | "errored"
}