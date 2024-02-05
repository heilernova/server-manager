import inquirer from "inquirer";
import { Response } from "../common/http.js";
import { startSpinner, stopSpinner } from "../common/spinner.js";
import { IServer } from "../config/config.interfaces.js";
import { inject } from "../core.js"

export const addProject = () => {
    let config = inject.config();
    let session: IServer;

    if (config.servers.length == 1){
        session = config.servers[0];
    } else if (config.servers.length > 0){
        process.exit();
    } else {
        console.log('Sign in to continue');
        process.exit();
    }

    let http = inject.httpClient().authentication(session.authentication);
    startSpinner('Loading project');
    http.get('http://localhost:3001/apps')
    .then(async response => {
        stopSpinner('Productos cargados', '✔');
        let info: { project: any, location: string, include: string } = await inquirer.prompt([
            { name: 'project',  message: 'Select project', type: 'list', choices: (response.data as any[]).map(x => { return { name: `${x.domain} - ${x.name}`, value: x } }) },
            { name: 'location', message: 'Location where the build is located', type: 'input' },
            { name: 'include', message: 'Include files', type: 'input' }
        ]);

        config.addProject({
            id: info.project.id,
            domina: info.project.domain,
            name: info.project.name,
            url: info.project.url,
            framework: info.project.framework,
            location: info.location,
            deployIn: session.url,
            include: info.include.split(','),
        });
    })
    .catch((err: Response) => {
        let message: string = '';
        if (err.status == 401) message = '[401] Session invalid';
        stopSpinner(message, '✘');
        console.log('Err');
    })
}