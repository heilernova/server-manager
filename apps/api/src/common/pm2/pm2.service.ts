import { execSync } from 'node:child_process';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Pm2Service {
    getAll(): Pm2Process[] {
        let result = execSync('pm2 jlist');
        return JSON.parse(result.toString());
    }

    start(path: string, script: string, name: string, env: { [key: string]: string }) {
        execSync(`pm2 start ${script} --name="${name}"`, { cwd: path, env: env as any });
    }

    stop(name: string){
        execSync(`pm2 stop ${name}`);
    }

    reload(name: string, env?: { [key: string]: string }){
        if (env){
            execSync(`pm2 reload ${name} --update-env`, { env: env as any });
        } else {
            execSync(`pm2 reload ${name}`);
        }
    }
}


export interface Pm2Process {
    pm_id: number,
    pid: number,
    name: string,
    pm2_env: { [key: string]: any }&{
        exit_code: number,
        node_version: string,
        version: string;
        PORT: string;
        status: "online" | "stopping" | "stopped" | "launching" | "errored" | "one-launch-status";
        pm_err_log_path: string;
        pm_out_log_path: string;
        pm_cwd: string;
        pm_exec_path: string;
        unstable_restarts: number;
        restart_time: number;
        pm_uptime: number;

    },
    monit: {
        cpu: number,
        memory: number
    }
}