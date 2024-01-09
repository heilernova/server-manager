import { existsSync, readFileSync } from 'node:fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    public readonly version: string;
    public readonly nodeEnv: "development" | "production";
    public readonly port: string;
    constructor(){
        this.nodeEnv = process.env.NODE_ENV;
        this.port = process.env.PORT ?? "3000";

        if (existsSync('package.json')){
            let packageJson = JSON.parse(readFileSync('package.json').toString());
            this.version = packageJson.version;
        } else  {
            this.version = '0.0.0';
        }
    }
}
