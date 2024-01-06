import { dirname } from 'node:path';
import { HttpClient } from './common/http.js';
import { CliCache } from './config/cli-cache.js';
import { loadConfig, loadConfigLocal, loadPackageJSON } from './config/load-config.js';
import { Config } from './config.js';

export const services: any[] = [];



export const factory = async () => {
    const dirBase: string = dirname(process.argv[1]);
    const config = loadConfig(dirBase);
    const packageJSON = loadPackageJSON(dirBase);
    const configLocal = loadConfigLocal();
    
    services.push(new Config(packageJSON.version ?? '0.0.0', dirBase, config, configLocal));
    services.push(new HttpClient);
    services.push(new CliCache());
}

export const inject =  {
    config: (): Config => services[0],
    httpClient: (): HttpClient => services[1],
    cache: (): CliCache => services[2]
}